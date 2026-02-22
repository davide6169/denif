// Mock payment processing for Denif E-commerce

import type { PaymentResult, PaymentMethod } from './types';

/**
 * Simulates payment processing with a delay and randomized success/failure
 * @param amount - Payment amount in euros
 * @param method - Payment method
 * @returns Payment result with transaction ID or error
 */
export async function processPayment(
	amount: number,
	method: PaymentMethod
): Promise<PaymentResult> {
	// Simulate network delay (2-3 seconds)
	const delay = 2000 + Math.random() * 1000;
	await new Promise((resolve) => setTimeout(resolve, delay));

	// Simulate 90% success rate, 10% failure
	const isSuccess = Math.random() < 0.9;

	if (!isSuccess) {
		return {
			success: false,
			error: getMockError(method),
		};
	}

	// Generate mock transaction ID
	const transactionId = generateTransactionId(method);

	return {
		success: true,
		transactionId,
	};
}

/**
 * Generate a mock transaction ID based on payment method
 */
function generateTransactionId(method: PaymentMethod): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();

	switch (method) {
		case 'card':
			return `CARD-${timestamp}-${random}`;
		case 'paypal':
			return `PAYPAL-${timestamp}-${random}`;
		case 'bank-transfer':
			return `BANK-${timestamp}-${random}`;
		default:
			return `TXN-${timestamp}-${random}`;
	}
}

/**
 * Get a mock error message based on payment method
 */
function getMockError(method: PaymentMethod): string {
	const errors = {
		card: [
			'Carta rifiutata dalla banca',
			'Fondi insufficienti',
			'Errore di verifica della carta',
			'Tempo limite della transazione',
		],
		paypal: [
			'Account PayPal non verificato',
			'Errore di connessione con PayPal',
			'Limite superato per questo account',
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
	// Minimum order amount
	if (amount < 10) {
		return {
			valid: false,
			error: 'Importo minimo ordine: €10.00',
		};
	}

	// Maximum order amount for security
	if (amount > 10000) {
		return {
			valid: false,
			error: 'Importo massimo ordine: €10,000.00',
		};
	}

	return { valid: true };
}
