// Stripe payment processing for Denif E-commerce

import Stripe from 'stripe';
import type { PaymentResult, PaymentMethod } from './types';

// Initialize Stripe
const getStripe = () => {
	const secretKey = import.meta.env.STRIPE_SECRET_KEY;

	if (!secretKey || secretKey.startsWith('sk_test_')) {
		// Using test key or no key - return null to use mock
		return null;
	}

	return new Stripe(secretKey, {
		apiVersion: '2025-01-27.acacia',
		typescript: true,
	});
};

/**
 * Process payment using Stripe
 */
export async function processStripePayment(
	amount: number,
	method: PaymentMethod,
	paymentMethodId?: string
): Promise<PaymentResult> {
	const stripe = getStripe();

	// If Stripe is not configured, fall back to mock
	if (!stripe) {
		console.warn('Stripe not configured, using mock payment');
		return processMockPayment(amount, method);
	}

	try {
		// Convert amount to cents for Stripe
		const amountInCents = Math.round(amount * 100);

		let paymentIntent;

		if (method === 'card' && paymentMethodId) {
			// Create payment intent with existing payment method
			paymentIntent = await stripe.paymentIntents.create({
				amount: amountInCents,
				currency: 'eur',
				payment_method: paymentMethodId,
				confirm: true,
				return_url: `${window.location.origin}/ordine-confermato`,
				metadata: {
					store: 'denif',
				},
			});
		} else {
			// Create payment intent without confirmation (for PayPal, etc.)
			paymentIntent = await stripe.paymentIntents.create({
				amount: amountInCents,
				currency: 'eur',
				payment_method_types: method === 'card' ? ['card'] : [],
				metadata: {
					store: 'denif',
					payment_method: method,
				},
			});
		}

		// Check if payment requires additional action
		if (paymentIntent.status === 'requires_action') {
			return {
				success: false,
				error: 'Pagamento richiede ulteriore azione',
				requiresAction: true,
				clientSecret: paymentIntent.client_secret,
			};
		}

		if (paymentIntent.status === 'succeeded') {
			return {
				success: true,
				transactionId: paymentIntent.id,
			};
		}

		return {
			success: false,
			error: 'Pagamento non completato',
		};
	} catch (error: any) {
		console.error('Stripe payment error:', error);

		return {
			success: false,
			error: error.message || 'Errore durante il pagamento',
		};
	}
}

/**
 * Create Stripe Payment Intent for client-side confirmation
 */
export async function createPaymentIntent(
	amount: number,
	method: PaymentMethod
): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
	const stripe = getStripe();

	if (!stripe) {
		return {
			success: false,
			error: 'Stripe non configurato',
		};
	}

	try {
		const amountInCents = Math.round(amount * 100);

		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInCents,
			currency: 'eur',
			payment_method_types: method === 'card' ? ['card'] : ['card'],
			metadata: {
				store: 'denif',
			},
		});

		return {
			success: true,
			clientSecret: paymentIntent.client_secret as string,
		};
	} catch (error: any) {
		console.error('Error creating payment intent:', error);

		return {
			success: false,
			error: error.message || 'Errore nella creazione del pagamento',
		};
	}
}

/**
 * Confirm payment intent on the server
 */
export async function confirmPaymentIntent(
	paymentIntentId: string,
	paymentMethodId: string
): Promise<PaymentResult> {
	const stripe = getStripe();

	if (!stripe) {
		return {
			success: false,
			error: 'Stripe non configurato',
		};
	}

	try {
		const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
			payment_method: paymentMethodId,
		});

		if (paymentIntent.status === 'succeeded') {
			return {
				success: true,
				transactionId: paymentIntent.id,
			};
		}

		return {
			success: false,
			error: 'Pagamento non confermato',
		};
	} catch (error: any) {
		console.error('Error confirming payment:', error);

		return {
			success: false,
			error: error.message || 'Errore nella conferma del pagamento',
		};
	}
}

/**
 * Mock payment processor for fallback/testing
 */
async function processMockPayment(
	amount: number,
	method: PaymentMethod
): Promise<PaymentResult> {
	// Simulate network delay
	const delay = 2000 + Math.random() * 1000;
	await new Promise((resolve) => setTimeout(resolve, delay));

	// Simulate 90% success rate
	const isSuccess = Math.random() < 0.9;

	if (!isSuccess) {
		return {
			success: false,
			error: getMockError(method),
		};
	}

	// Generate mock transaction ID
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();
	const transactionId = `MOCK-${timestamp}-${random}`;

	return {
		success: true,
		transactionId,
	};
}

function getMockError(method: PaymentMethod): string {
	const errors = {
		card: [
			'Carta rifiutata dalla banca',
			'Fondi insufficienti',
			'Errore di verifica della carta',
		],
		paypal: [
			'Account PayPal non verificato',
			'Errore di connessione con PayPal',
		],
		'bank-transfer': [
			'Errore di elaborazione bonifico',
			'Dati bancari non validi',
		],
	};

	const methodErrors = errors[method] || errors.card;
	return methodErrors[Math.floor(Math.random() * methodErrors.length)];
}

/**
 * Validate payment method requirements
 */
export function validatePaymentMethod(method: PaymentMethod, amount: number): { valid: boolean; error?: string } {
	if (amount < 10) {
		return {
			valid: false,
			error: 'Importo minimo ordine: €10.00',
		};
	}

	if (amount > 10000) {
		return {
			valid: false,
			error: 'Importo massimo ordine: €10,000.00',
		};
	}

	return { valid: true };
}

/**
 * Get Stripe publishable key for client
 */
export function getStripePublicKey(): string | null {
	const publicKey = import.meta.env.PUBLIC_STRIPE_PUBLIC_KEY;

	if (!publicKey || publicKey.includes('your_stripe_public_key_here')) {
		return null;
	}

	return publicKey;
}
