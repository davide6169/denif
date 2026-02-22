// AirTable API client for managing orders

interface AirTableOrderRecord {
	id: string;
	createdTime: string;
	fields: {
		OrderID?: string;
		CustomerEmail?: string;
		CustomerName?: string;
		CustomerPhone?: string;
		ShippingAddress?: string;
		City?: string;
		PostalCode?: string;
		Country?: string;
		OrderItems?: string; // JSON stringified
		TotalAmount?: number;
		PaymentMethod?: string;
		TransactionID?: string;
		Status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
		EstimatedDelivery?: string;
		ActualDelivery?: string;
		TrackingNumber?: string;
		Carrier?: string;
		Notes?: string;
		CreatedAt?: string;
		UpdatedAt?: string;
	};
}

interface OrderItem {
	productId: string;
	name: string;
	quantity: number;
	price: number;
}

interface CreateOrderData {
	orderId: string;
	customerEmail: string;
	customerName: string;
	customerPhone: string;
	shippingAddress: string;
	city: string;
	postalCode: string;
	country: string;
	items: OrderItem[];
	totalAmount: number;
	paymentMethod: string;
	transactionId: string;
	notes?: string;
}

// Environment variables
const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_ORDERS_TABLE = import.meta.env.AIRTABLE_ORDERS_TABLE || 'Ordini';

/**
 * Create a new order in AirTable
 */
export async function createOrderInAirtable(orderData: CreateOrderData): Promise<AirTableOrderRecord | null> {
	if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		console.warn('AirTable credentials not configured, skipping order sync');
		return null;
	}

	try {
		const now = new Date().toISOString();
		const estimatedDelivery = calculateEstimatedDelivery();

		const response = await fetch(
			`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORDERS_TABLE)}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${AIRTABLE_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					records: [
						{
							fields: {
								OrderID: orderData.orderId,
								CustomerEmail: orderData.customerEmail,
								CustomerName: orderData.customerName,
								CustomerPhone: orderData.customerPhone,
								ShippingAddress: orderData.shippingAddress,
								City: orderData.city,
								PostalCode: orderData.postalCode,
								Country: orderData.country,
								OrderItems: JSON.stringify(orderData.items),
								TotalAmount: orderData.totalAmount,
								PaymentMethod: orderData.paymentMethod,
								TransactionID: orderData.transactionId,
								Status: 'confirmed',
								EstimatedDelivery: estimatedDelivery,
								Notes: orderData.notes || '',
								CreatedAt: now,
								UpdatedAt: now,
							},
						},
					],
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`AirTable API error: ${JSON.stringify(errorData)}`);
		}

		const data = await response.json();
		return data.records[0];
	} catch (error) {
		console.error('Error creating order in AirTable:', error);
		throw error;
	}
}

/**
 * Update order status in AirTable
 */
export async function updateOrderStatusInAirtable(
	orderId: string,
	status: AirTableOrderRecord['fields']['Status'],
	additionalFields?: Partial<AirTableOrderRecord['fields']>
): Promise<boolean> {
	if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		console.warn('AirTable credentials not configured');
		return false;
	}

	try {
		// First, find the order by OrderID
		const order = await findOrderByOrderId(orderId);
		if (!order) {
			console.error(`Order ${orderId} not found in AirTable`);
			return false;
		}

		const now = new Date().toISOString();

		const response = await fetch(
			`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORDERS_TABLE)}/${order.id}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${AIRTABLE_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fields: {
						Status: status,
						UpdatedAt: now,
						...additionalFields,
					},
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`AirTable API error: ${response.statusText}`);
		}

		return true;
	} catch (error) {
		console.error('Error updating order status in AirTable:', error);
		return false;
	}
}

/**
 * Find order by OrderID in AirTable
 */
async function findOrderByOrderId(orderId: string): Promise<AirTableOrderRecord | null> {
	if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		return null;
	}

	try {
		const response = await fetch(
			`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORDERS_TABLE)}?filterByFormula={OrderID}="${orderId}"`,
			{
				headers: {
					Authorization: `Bearer ${AIRTABLE_API_KEY}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`AirTable API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.records[0] || null;
	} catch (error) {
		console.error('Error finding order in AirTable:', error);
		return null;
	}
}

/**
 * Get order by OrderID from AirTable
 */
export async function getOrderFromAirtable(orderId: string): Promise<AirTableOrderRecord | null> {
	return findOrderByOrderId(orderId);
}

/**
 * Calculate estimated delivery date (3-5 business days from now)
 */
function calculateEstimatedDelivery(): string {
	const today = new Date();
	const deliveryDays = 3 + Math.floor(Math.random() * 3); // 3-5 days

	const deliveryDate = new Date(today);
	deliveryDate.setDate(today.getDate() + deliveryDays);

	return deliveryDate.toISOString();
}

/**
 * Update tracking information for shipped orders
 */
export async function updateShippingInfoInAirtable(
	orderId: string,
	trackingNumber: string,
	carrier: string
): Promise<boolean> {
	return updateOrderStatusInAirtable(orderId, 'shipped', {
		TrackingNumber: trackingNumber,
		Carrier: carrier,
	});
}
