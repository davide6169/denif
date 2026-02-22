// API endpoint for processing orders
// Handles payment, AirTable sync, and email notifications

import type { APIRoute } from 'astro';
import { processStripePayment } from '../../lib/stripe';
import { createOrderInAirtable } from '../../lib/airtable-orders';
import { sendOrderConfirmationEmail } from '../../lib/email';
import { generateOrderId } from '../../lib/order-storage';
import type { Order, CartItem, CustomerInfo, PaymentMethod } from '../../lib/types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();

		// Validate request body
		const { cartItems, customer, paymentMethod, paymentMethodId } = body;

		if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
			return new Response(JSON.stringify({ error: 'Carrello vuoto' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
			return new Response(JSON.stringify({ error: 'Dati cliente mancanti' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Calculate total
		const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

		// Process payment
		console.log('Processing payment...');
		const paymentResult = await processStripePayment(total, paymentMethod as PaymentMethod, paymentMethodId);

		if (!paymentResult.success) {
			return new Response(
				JSON.stringify({
					error: paymentResult.error || 'Pagamento fallito',
					requiresAction: paymentResult.requiresAction,
					clientSecret: paymentResult.clientSecret,
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Create order
		const orderId = generateOrderId();
		const order: Order = {
			orderId,
			items: cartItems,
			total,
			customer: {
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				phone: customer.phone,
				address: customer.address,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
			},
			paymentMethod: paymentMethod as PaymentMethod,
			transactionId: paymentResult.transactionId || '',
			status: 'confirmed',
			createdAt: new Date().toISOString(),
			estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
		};

		// Sync to AirTable (non-blocking)
		try {
			console.log('Syncing order to AirTable...');
			await createOrderInAirtable({
				orderId,
				customerEmail: customer.email,
				customerName: `${customer.firstName} ${customer.lastName}`,
				customerPhone: customer.phone || '',
				shippingAddress: customer.address,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
				items: cartItems.map((item: CartItem) => ({
					productId: item.id,
					name: item.name,
					quantity: item.quantity,
					price: item.price,
				})),
				totalAmount: total,
				paymentMethod: paymentMethod,
				transactionId: paymentResult.transactionId || '',
				notes: customer.notes || '',
			});
			console.log('Order synced to AirTable');
		} catch (airtableError) {
			console.error('AirTable sync failed:', airtableError);
			// Don't fail the order if AirTable sync fails
		}

		// Send confirmation email (non-blocking)
		try {
			console.log('Sending confirmation email...');
			await sendOrderConfirmationEmail(customer.email, `${customer.firstName} ${customer.lastName}`, order);
			console.log('Confirmation email sent');
		} catch (emailError) {
			console.error('Email send failed:', emailError);
			// Don't fail the order if email fails
		}

		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				orderId,
				transactionId: paymentResult.transactionId,
				order,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error: any) {
		console.error('Checkout API error:', error);
		return new Response(
			JSON.stringify({
				error: error.message || 'Errore durante l\'elaborazione dell\'ordine',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};
