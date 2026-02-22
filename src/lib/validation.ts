// Form validation utilities for Denif E-commerce

import type { CustomerInfo, ValidationError } from './types';

/**
 * Validate Italian email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
	if (!email || email.trim() === '') {
		return { valid: false, error: 'L\'email è obbligatoria' };
	}

	// Italian email regex
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) {
		return { valid: false, error: 'Email non valida' };
	}

	// Check for common Italian domains
	const italianDomains = ['.it', '.com', '.eu', '.org', '.net'];
	const hasValidDomain = italianDomains.some((domain) =>
		email.toLowerCase().endsWith(domain)
	);

	if (!hasValidDomain) {
		return { valid: false, error: 'Email deve terminare con .it, .com, .eu, .org o .net' };
	}

	return { valid: true };
}

/**
 * Validate Italian phone number (10-12 digits)
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
	if (!phone || phone.trim() === '') {
		return { valid: false, error: 'Il telefono è obbligatorio' };
	}

	// Remove spaces, dashes, etc.
	const cleaned = phone.replace(/[\s\-\+]/g, '');

	// Italian phone: starts with 3 and has 10 digits, or landline with area code
	const phoneRegex = /^3\d{8,9}$/;
	if (!phoneRegex.test(cleaned)) {
		return { valid: false, error: 'Telefono non valido (deve iniziare con 3 e avere 10-12 cifre)' };
	}

	return { valid: true };
}

/**
 * Validate Italian postal code (CAP) - 5 digits
 */
export function validatePostalCode(postalCode: string): { valid: boolean; error?: string } {
	if (!postalCode || postalCode.trim() === '') {
		return { valid: false, error: 'Il CAP è obbligatorio' };
	}

	const capRegex = /^\d{5}$/;
	if (!capRegex.test(postalCode)) {
		return { valid: false, error: 'CAP non valido (deve essere 5 cifre)' };
	}

	// Valid Italian CAP ranges
	const num = parseInt(postalCode, 10);
	const validRanges = [
		[0, 99999], // All valid Italian CAPs
	];

	const isValidRange = validRanges.some(([min, max]) => num >= min && num <= max);

	if (!isValidRange) {
		return { valid: false, error: 'CAP non valido' };
	}

	return { valid: true };
}

/**
 * Validate name fields (firstName, lastName)
 */
export function validateName(name: string, fieldName: string): { valid: boolean; error?: string } {
	if (!name || name.trim() === '') {
		return { valid: false, error: `${fieldName} è obbligatorio` };
	}

	if (name.trim().length < 2) {
		return { valid: false, error: `${fieldName} deve essere almeno 2 caratteri` };
	}

	if (name.trim().length > 50) {
		return { valid: false, error: `${fieldName} non può superare 50 caratteri` };
	}

	// Only letters and spaces
	const nameRegex = /^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s'\-]+$/;
	if (!nameRegex.test(name)) {
		return { valid: false, error: `${fieldName} può contenere solo lettere` };
	}

	return { valid: true };
}

/**
 * Validate address
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
	if (!address || address.trim() === '') {
		return { valid: false, error: 'L\'indirizzo è obbligatorio' };
	}

	if (address.trim().length < 5) {
		return { valid: false, error: 'L\'indirizzo deve essere almeno 5 caratteri' };
	}

	if (address.trim().length > 100) {
		return { valid: false, error: 'L\'indirizzo non può superare 100 caratteri' };
	}

	return { valid: true };
}

/**
 * Validate city
 */
export function validateCity(city: string): { valid: boolean; error?: string } {
	if (!city || city.trim() === '') {
		return { valid: false, error: 'La città è obbligatoria' };
	}

	if (city.trim().length < 2) {
		return { valid: false, error: 'La città deve essere almeno 2 caratteri' };
	}

	return { valid: true };
}

/**
 * Validate country
 */
export function validateCountry(country: string): { valid: boolean; error?: string } {
	if (!country || country.trim() === '') {
		return { valid: false, error: 'Il paese è obbligatorio' };
	}

	return { valid: true };
}

/**
 * Validate all customer information
 */
export function validateCustomerInfo(
	customer: CustomerInfo
): { valid: boolean; errors: ValidationError[] } {
	const errors: ValidationError[] = [];

	// Validate first name
	const firstNameResult = validateName(customer.firstName, 'Nome');
	if (!firstNameResult.valid) {
		errors.push({ field: 'firstName', message: firstNameResult.error! });
	}

	// Validate last name
	const lastNameResult = validateName(customer.lastName, 'Cognome');
	if (!lastNameResult.valid) {
		errors.push({ field: 'lastName', message: lastNameResult.error! });
	}

	// Validate email
	const emailResult = validateEmail(customer.email);
	if (!emailResult.valid) {
		errors.push({ field: 'email', message: emailResult.error! });
	}

	// Validate phone
	const phoneResult = validatePhone(customer.phone);
	if (!phoneResult.valid) {
		errors.push({ field: 'phone', message: phoneResult.error! });
	}

	// Validate address
	const addressResult = validateAddress(customer.address);
	if (!addressResult.valid) {
		errors.push({ field: 'address', message: addressResult.error! });
	}

	// Validate city
	const cityResult = validateCity(customer.city);
	if (!cityResult.valid) {
		errors.push({ field: 'city', message: cityResult.error! });
	}

	// Validate postal code
	const postalCodeResult = validatePostalCode(customer.postalCode);
	if (!postalCodeResult.valid) {
		errors.push({ field: 'postalCode', message: postalCodeResult.error! });
	}

	// Validate country
	const countryResult = validateCountry(customer.country);
	if (!countryResult.valid) {
		errors.push({ field: 'country', message: countryResult.error! });
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
	if (!input) return '';

	return input
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}
