// Type definitions for Denif E-commerce

export interface CartItem {
	id: string;
	name: string;
	price: number;
	image: string;
	size: string;
	quantity: number;
}

export interface CustomerInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
	notes?: string;
}

export interface OrderItem {
	id: string;
	name: string;
	price: number;
	image: string;
	size: string;
	quantity: number;
	subtotal: number;
}

export interface OrderTotals {
	subtotal: number;
	shipping: number;
	total: number;
}

export type PaymentMethod = 'card' | 'paypal' | 'bank-transfer';

export interface PaymentInfo {
	method: PaymentMethod;
	transactionId?: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
	orderId: string;
	customer: CustomerInfo;
	items: OrderItem[];
	payment: PaymentInfo;
	totals: OrderTotals;
	status: OrderStatus;
	createdAt: string;
	estimatedDelivery?: string;
}

export interface OrderStorage {
	orders: Order[];
}

export interface ValidationError {
	field: string;
	message: string;
}

export interface PaymentResult {
	success: boolean;
	transactionId?: string;
	error?: string;
}

export interface CheckoutFormData extends CustomerInfo {
	paymentMethod: PaymentMethod;
}
