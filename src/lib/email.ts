// Email service using Resend for Denif E-commerce

import { Resend } from 'resend';
import type { Order, OrderItem } from './types';

// Initialize Resend
const getResend = () => {
	const apiKey = import.meta.env.RESEND_API_KEY;

	if (!apiKey || apiKey.includes('your_resend_api_key_here')) {
		return null;
	}

	return new Resend(apiKey);
};

const STORE_EMAIL = import.meta.env.STORE_EMAIL || 'info@denif.it';
const STORE_NAME = 'Denif - Scarpe Artigianali';

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
	customerEmail: string,
	customerName: string,
	order: Order
): Promise<{ success: boolean; error?: string }> {
	const resend = getResend();

	if (!resend) {
		console.warn('Resend not configured, skipping email');
		return { success: false, error: 'Email service not configured' };
	}

	try {
		const { data, error } = await resend.emails.send({
			from: `${STORE_NAME} <${STORE_EMAIL}>`,
			to: [customerEmail],
			subject: `Conferma Ordine ${order.orderId} - ${STORE_NAME}`,
			html: generateOrderConfirmationTemplate(customerName, order),
			text: generateOrderConfirmationText(customerName, order),
		});

		if (error) {
			console.error('Resend error:', error);
			return { success: false, error: error.message };
		}

		console.log('Order confirmation email sent:', data);
		return { success: true };
	} catch (error: any) {
		console.error('Error sending order confirmation email:', error);
		return { success: false, error: error.message };
	}
}

/**
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(
	customerEmail: string,
	customerName: string,
	orderId: string,
	trackingNumber: string,
	carrier: string
): Promise<{ success: boolean; error?: string }> {
	const resend = getResend();

	if (!resend) {
		console.warn('Resend not configured, skipping email');
		return { success: false, error: 'Email service not configured' };
	}

	try {
		const { data, error } = await resend.emails.send({
			from: `${STORE_NAME} <${STORE_EMAIL}>`,
			to: [customerEmail],
			subject: `Il tuo ordine ${orderId} è stato spedito! 📦`,
			html: generateShippingNotificationTemplate(customerName, orderId, trackingNumber, carrier),
			text: generateShippingNotificationText(customerName, orderId, trackingNumber, carrier),
		});

		if (error) {
			console.error('Resend error:', error);
			return { success: false, error: error.message };
		}

		console.log('Shipping notification email sent:', data);
		return { success: true };
	} catch (error: any) {
		console.error('Error sending shipping notification email:', error);
		return { success: false, error: error.message };
	}
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(
	customerEmail: string,
	customerName: string,
	orderId: string,
	status: string
): Promise<{ success: boolean; error?: string }> {
	const resend = getResend();

	if (!resend) {
		console.warn('Resend not configured, skipping email');
		return { success: false, error: 'Email service not configured' };
	}

	try {
		const { data, error } = await resend.emails.send({
			from: `${STORE_NAME} <${STORE_EMAIL}>`,
			to: [customerEmail],
			subject: `Aggiornamento ordine ${orderId}`,
			html: generateOrderStatusUpdateTemplate(customerName, orderId, status),
			text: generateOrderStatusUpdateText(customerName, orderId, status),
		});

		if (error) {
			console.error('Resend error:', error);
			return { success: false, error: error.message };
		}

		console.log('Order status update email sent:', data);
		return { success: true };
	} catch (error: any) {
		console.error('Error sending order status update email:', error);
		return { success: false, error: error.message };
	}
}

// ============ EMAIL TEMPLATES ============

function generateOrderConfirmationTemplate(customerName: string, order: Order): string {
	const itemsHtml = order.items
		.map(
			(item) => `
		<tr>
			<td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
				<div style="font-size: 16px; color: #1f2937; margin-bottom: 4px;">${item.name}</div>
				<div style="font-size: 14px; color: #6b7280;">Quantità: ${item.quantity} × €${item.price.toFixed(2)}</div>
			</td>
			<td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 16px; color: #1f2937; font-weight: 600;">
				€${(item.quantity * item.price).toFixed(2)}
			</td>
		</tr>
	`
		)
		.join('');

	const estimatedDelivery = order.estimatedDelivery
		? new Date(order.estimatedDelivery).toLocaleDateString('it-IT', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
		  })
		: '3-5 giorni lavorativi';

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Conferma Ordine ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
	<table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
		<!-- Header -->
		<tr>
			<td style="padding: 40px 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); text-align: center;">
				<h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">DENIF</h1>
				<p style="margin: 8px 0 0 0; font-size: 14px; color: #d1d5db;">Design · Emozioni · Natura · Innovazione · Finiture</p>
			</td>
		</tr>

		<!-- Content -->
		<tr>
			<td style="padding: 40px 30px;">
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					Ciao <strong>${customerName}</strong>,
				</p>
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					Grazie per il tuo ordine! Confermiamo di aver ricevuto il tuo ordine
					<strong>#${order.orderId}</strong>
					e che è stato pagato con successo.
				</p>

				<!-- Order Details -->
				<table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 30px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
					<tr>
						<td colspan="2" style="padding: 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
							<div style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Riepilogo Ordine</div>
						</td>
					</tr>
					${itemsHtml}
					<tr>
						<td style="padding: 16px 0; font-size: 16px; color: #1f2937; font-weight: 600;">
							Totale
						</td>
						<td style="padding: 16px 0; text-align: right; font-size: 20px; color: #1f2937; font-weight: 700;">
							€${order.total.toFixed(2)}
						</td>
					</tr>
				</table>

				<!-- Shipping Info -->
				<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Indirizzo di Spedizione</h3>
					<p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
						${order.customer.firstName} ${order.customer.lastName}<br>
						${order.customer.address}<br>
						${order.customer.postalCode} ${order.customer.city}<br>
						${order.customer.country}
					</p>
				</div>

				<!-- Estimated Delivery -->
				<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
					<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">Consegna Stimata</p>
					<p style="margin: 0; font-size: 14px; color: #78350f;">${estimatedDelivery}</p>
				</div>

				<p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
					Ti invieremo un'email quando il tuo ordine sarà spedito con il numero di tracking.
				</p>
			</td>
		</tr>

		<!-- Footer -->
		<tr>
			<td style="padding: 30px; background-color: #1a1a1a; text-align: center;">
				<p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
					Hai domande? Contattaci via email all'indirizzo
					<a href="mailto:${STORE_EMAIL}" style="color: #ffffff; text-decoration: underline;">${STORE_EMAIL}</a>
				</p>
				<p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">
					My Hands. Your steps. Scarpe fatte a mano da un'artigiana ex-Fendi.
				</p>
			</td>
		</tr>
	</table>
</body>
</html>
	`;
}

function generateOrderConfirmationText(customerName: string, order: Order): string {
	const itemsText = order.items
		.map((item) => `- ${item.name} (x${item.quantity}) - €${(item.quantity * item.price).toFixed(2)}`)
		.join('\n');

	return `
Ciao ${customerName},

Grazie per il tuo ordine! Confermiamo di aver ricevuto il tuo ordine #${order.orderId}.

RIEPILOGO ORDINE
${itemsText}

Totale: €${order.total.toFixed(2)}

Indirizzo di Spedizione:
${order.customer.firstName} ${order.customer.lastName}
${order.customer.address}
${order.customer.postalCode} ${order.customer.city}
${order.customer.country}

Metodo di Pagamento: ${order.paymentMethod === 'card' ? 'Carta di Credito/Debito' : order.paymentMethod === 'paypal' ? 'PayPal' : 'Bonifico Bancario'}
Transaction ID: ${order.transactionId}

Ti invieremo un'email quando il tuo ordine sarà spedito.

Grazie per aver scelto Denif!
My Hands. Your steps.
	`;
}

function generateShippingNotificationTemplate(
	customerName: string,
	orderId: string,
	trackingNumber: string,
	carrier: string
): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Il tuo ordine è stato spedito!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 20px;">
	<table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
		<tr>
			<td style="padding: 40px 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); text-align: center;">
				<h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">DENIF</h1>
			</td>
		</tr>
		<tr>
			<td style="padding: 40px 30px;">
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					Ciao <strong>${customerName}</strong>,
				</p>
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					Ottima notizia! Il tuo ordine <strong>#${orderId}</strong> è stato spedito ed è in viaggio verso di te! 📦
				</p>

				<div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin: 20px 0;">
					<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #065f46;">Tracking Information</p>
					<p style="margin: 0; font-size: 14px; color: #047857;">
						<strong>Corriere:</strong> ${carrier}<br>
						<strong>Numero di Tracking:</strong> ${trackingNumber}
					</p>
				</div>

				<p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
					Puoi tracciare la tua spedizione usando il numero di tracking sopra indicato.
				</p>
			</td>
		</tr>
		<tr>
			<td style="padding: 30px; background-color: #1a1a1a; text-align: center;">
				<p style="margin: 0; font-size: 12px; color: #9ca3af;">
					My Hands. Your steps. Scarpe fatte a mano da un'artigiana ex-Fendi.
				</p>
			</td>
		</tr>
	</table>
</body>
</html>
	`;
}

function generateShippingNotificationText(
	customerName: string,
	orderId: string,
	trackingNumber: string,
	carrier: string
): string {
	return `
Ciao ${customerName},

Ottima notizia! Il tuo ordine #${orderId} è stato spedito!

Corriere: ${carrier}
Numero di Tracking: ${trackingNumber}

Puoi tracciare la tua spedizione usando il numero di tracking.

Grazie per aver scelto Denif!
	`;
}

function generateOrderStatusUpdateTemplate(customerName: string, orderId: string, status: string): string {
	const statusMessages: Record<string, string> = {
		processing: 'Il tuo ordine è in preparazione',
		shipped: 'Il tuo ordine è stato spedito',
		delivered: 'Il tuo ordine è stato consegnato',
		cancelled: 'Il tuo ordine è stato cancellato',
	};

	const message = statusMessages[status] || `Il tuo ordine è: ${status}`;

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Aggiornamento ordine ${orderId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 20px;">
	<table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
		<tr>
			<td style="padding: 40px 30px;">
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					Ciao <strong>${customerName}</strong>,
				</p>
				<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
					${message}.
				</p>
				<p style="margin: 0; font-size: 14px; color: #6b7280;">
					Ordine: #${orderId}
				</p>
			</td>
		</tr>
	</table>
</body>
</html>
	`;
}

function generateOrderStatusUpdateText(customerName: string, orderId: string, status: string): string {
	const statusMessages: Record<string, string> = {
		processing: 'in preparazione',
		shipped: 'spedito',
		delivered: 'consegnato',
		cancelled: 'cancellato',
	};

	return `
Ciao ${customerName},

Il tuo ordine #${orderId} è ${statusMessages[status] || status}.

Grazie,
Denif
	`;
}
