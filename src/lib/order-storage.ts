// LocalStorage CRUD operations for orders

import type { Order, OrderStorage, CartItem } from './types';

const STORAGE_KEY = 'denif-orders';
const CART_KEY = 'denif-cart';

/**
 * Get all orders from localStorage
 */
export function getOrders(): Order[] {
	if (typeof localStorage === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const data: OrderStorage = JSON.parse(stored);
		return data.orders || [];
	} catch (error) {
		console.error('Error loading orders from localStorage:', error);
		return [];
	}
}

/**
 * Get a single order by ID
 */
export function getOrderById(orderId: string): Order | null {
	const orders = getOrders();
	return orders.find((order) => order.orderId === orderId) || null;
}

/**
 * Save a new order to localStorage
 */
export function saveOrder(order: Order): void {
	if (typeof localStorage === 'undefined') return;

	try {
		const orders = getOrders();
		orders.unshift(order); // Add new orders at the beginning

		const data: OrderStorage = { orders };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving order to localStorage:', error);
		throw new Error('Impossibile salvare l\'ordine');
	}
}

/**
 * Update order status
 */
export function updateOrderStatus(orderId: string, status: Order['status']): boolean {
	if (typeof localStorage === 'undefined') return false;

	try {
		const orders = getOrders();
		const orderIndex = orders.findIndex((order) => order.orderId === orderId);

		if (orderIndex === -1) {
			return false;
		}

		orders[orderIndex].status = status;

		const data: OrderStorage = { orders };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

		return true;
	} catch (error) {
		console.error('Error updating order status:', error);
		return false;
	}
}

/**
 * Delete an order (for admin purposes)
 */
export function deleteOrder(orderId: string): boolean {
	if (typeof localStorage === 'undefined') return false;

	try {
		const orders = getOrders();
		const filteredOrders = orders.filter((order) => order.orderId !== orderId);

		const data: OrderStorage = { orders: filteredOrders };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

		return true;
	} catch (error) {
		console.error('Error deleting order:', error);
		return false;
	}
}

/**
 * Clear all orders (for testing purposes)
 */
export function clearAllOrders(): void {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing orders:', error);
	}
}

/**
 * Get cart items
 */
export function getCartItems(): CartItem[] {
	if (typeof localStorage === 'undefined') return [];

	try {
		const stored = localStorage.getItem(CART_KEY);
		if (!stored) return [];

		return JSON.parse(stored);
	} catch (error) {
		console.error('Error loading cart from localStorage:', error);
		return [];
	}
}

/**
 * Clear cart after successful order
 */
export function clearCart(): void {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.removeItem(CART_KEY);
	} catch (error) {
		console.error('Error clearing cart:', error);
	}
}

/**
 * Calculate estimated delivery date (3-5 business days from now)
 */
export function calculateEstimatedDelivery(): string {
	const today = new Date();
	const deliveryDays = 3 + Math.floor(Math.random() * 3); // 3-5 days

	const deliveryDate = new Date(today);
	deliveryDate.setDate(today.getDate() + deliveryDays);

	return deliveryDate.toISOString();
}

/**
 * Generate a unique order ID in format ORD-YYYY-XXXXXX
 */
export function generateOrderId(): string {
	const year = new Date().getFullYear();
	const timestamp = Date.now().toString().slice(-6);
	const random = Math.random().toString(36).substring(2, 4).toUpperCase();

	return `ORD-${year}-${timestamp}${random}`;
}
