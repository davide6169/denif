// Webhook endpoint for order status updates from AirTable
// Can be triggered by AirTable automations or external services

import type { APIRoute } from 'astro';
import { updateOrderStatusInAirtable, updateShippingInfoInAirtable } from '../../../lib/airtable-orders';
import { sendOrderStatusUpdateEmail, sendShippingNotificationEmail } from '../../../lib/email';

export const prerender = false;

// Verify webhook secret (optional, for security)
const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET || 'your-webhook-secret';

function verifyWebhookSignature(request: Request): boolean {
	// In production, verify HMAC signature or API key
	// For now, just check for a secret header
	const signature = request.headers.get('x-webhook-secret');
	return signature === WEBHOOK_SECRET || !WEBHOOK_SECRET || WEBHOOK_SECRET === 'your-webhook-secret';
}

export const POST: APIRoute = async ({ request }) => {
	try {
		// Verify webhook (optional)
		if (!verifyWebhookSignature(request)) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const body = await request.json();

		// Validate request
		const { orderId, status, trackingNumber, carrier } = body;

		if (!orderId) {
			return new Response(JSON.stringify({ error: 'Order ID required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!status) {
			return new Response(JSON.stringify({ error: 'Status required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Valid statuses
		const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
		if (!validStatuses.includes(status)) {
			return new Response(JSON.stringify({ error: 'Invalid status' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		console.log(`Updating order ${orderId} to status: ${status}`);

		// Update status in AirTable
		let success = false;

		if (status === 'shipped' && trackingNumber && carrier) {
			// Update with shipping info
			success = await updateShippingInfoInAirtable(orderId, trackingNumber, carrier);

			// Send shipping notification email
			if (success) {
				// Get order details from AirTable to get customer email
				const order = await import('../../../lib/airtable-orders').then((m) => m.getOrderFromAirtable(orderId));

				if (order?.fields.CustomerEmail) {
					try {
						await sendShippingNotificationEmail(
							order.fields.CustomerEmail,
							order.fields.CustomerName || 'Cliente',
							orderId,
							trackingNumber,
							carrier
						);
						console.log('Shipping notification email sent');
					} catch (emailError) {
						console.error('Failed to send shipping notification email:', emailError);
					}
				}
			}
		} else {
			// Update status only
			success = await updateOrderStatusInAirtable(orderId, status as any);

			// Send status update email
			if (success && status !== 'confirmed') {
				// Don't send email for confirmed (already sent on checkout)
				const order = await import('../../../lib/airtable-orders').then((m) => m.getOrderFromAirtable(orderId));

				if (order?.fields.CustomerEmail) {
					try {
						await sendOrderStatusUpdateEmail(
							order.fields.CustomerEmail,
							order.fields.CustomerName || 'Cliente',
							orderId,
							status
						);
						console.log('Status update email sent');
					} catch (emailError) {
						console.error('Failed to send status update email:', emailError);
					}
				}
			}
		}

		if (success) {
			return new Response(
				JSON.stringify({
					success: true,
					message: `Order ${orderId} updated to ${status}`,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		} else {
			return new Response(
				JSON.stringify({
					error: 'Failed to update order',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
	} catch (error: any) {
		console.error('Order status webhook error:', error);
		return new Response(
			JSON.stringify({
				error: error.message || 'Internal server error',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};

// GET endpoint for testing
export const GET: APIRoute = async ({ url }) => {
	const orderId = url.searchParams.get('orderId');
	const status = url.searchParams.get('status');
	const trackingNumber = url.searchParams.get('trackingNumber');
	const carrier = url.searchParams.get('carrier');

	if (!orderId || !status) {
		return new Response(JSON.stringify({ error: 'orderId and status required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Process the update
	const body = { orderId, status, trackingNumber, carrier };

	// Reuse POST logic
	const mockRequest = new Request(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	// Call POST handler
	const response = await POST({ request: mockRequest } as any);
	return response;
};
