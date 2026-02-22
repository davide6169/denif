import { useState } from 'react';
import type { CustomerInfo, PaymentMethod, ValidationError } from '../lib/types';
import {
	validateEmail,
	validatePhone,
	validatePostalCode,
	validateName,
	validateAddress,
	validateCity,
	validateCountry,
	sanitizeInput,
} from '../lib/validation';

interface CheckoutFormProps {
	onSubmit: (customer: CustomerInfo, paymentMethod: PaymentMethod) => void;
	isLoading: boolean;
}

interface FormErrors {
	[field: string]: string;
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
	const [formData, setFormData] = useState<CustomerInfo>({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		postalCode: '',
		country: 'Italia',
		notes: '',
	});

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Set<string>>(new Set());

	const validateField = (name: string, value: string): string | null => {
		switch (name) {
			case 'firstName':
			case 'lastName':
				return validateName(value, name === 'firstName' ? 'Nome' : 'Cognome').error || null;
			case 'email':
				return validateEmail(value).error || null;
			case 'phone':
				return validatePhone(value).error || null;
			case 'address':
				return validateAddress(value).error || null;
			case 'city':
				return validateCity(value).error || null;
			case 'postalCode':
				return validatePostalCode(value).error || null;
			case 'country':
				return validateCountry(value).error || null;
			default:
				return null;
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const sanitized = sanitizeInput(value);

		setFormData((prev) => ({ ...prev, [name]: sanitized }));

		// Validate field if it has been touched
		if (touched.has(name)) {
			const error = validateField(name, sanitized);
			setErrors((prev) => ({ ...prev, [name]: error || '' }));
		}
	};

	const handleBlur = (name: string) => {
		setTouched((prev) => new Set([...prev, name]));
		const error = validateField(name, formData[name as keyof CustomerInfo]);
		setErrors((prev) => ({ ...prev, [name]: error || '' }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const newErrors: FormErrors = {};
		let hasErrors = false;

		Object.keys(formData).forEach((key) => {
			if (key === 'notes') return; // Skip notes validation
			const error = validateField(key, formData[key as keyof CustomerInfo]);
			if (error) {
				newErrors[key] = error;
				hasErrors = true;
			}
		});

		if (hasErrors) {
			setErrors(newErrors);
			setTouched(new Set(Object.keys(formData)));
			return;
		}

		onSubmit(formData, paymentMethod);
	};

	const inputClasses = (fieldName: string) =>
		`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors ${
			errors[fieldName] ? 'border-red-500' : 'border-neutral-300'
		}`;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
				Informazioni di Spedizione
			</h2>

			{/* Name Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
						Nome *
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						onBlur={() => handleBlur('firstName')}
						className={inputClasses('firstName')}
						disabled={isLoading}
						required
					/>
					{errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
				</div>

				<div>
					<label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
						Cognome *
					</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						onBlur={() => handleBlur('lastName')}
						className={inputClasses('lastName')}
						disabled={isLoading}
						required
					/>
					{errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
				</div>
			</div>

			{/* Email */}
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
					Email *
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					onBlur={() => handleBlur('email')}
					className={inputClasses('email')}
					placeholder="nome@esempio.it"
					disabled={isLoading}
					required
				/>
				{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
			</div>

			{/* Phone */}
			<div>
				<label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
					Telefono *
				</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					onBlur={() => handleBlur('phone')}
					className={inputClasses('phone')}
					placeholder="3123456789"
					disabled={isLoading}
					required
				/>
				{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
			</div>

			{/* Address */}
			<div>
				<label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
					Indirizzo *
				</label>
				<input
					type="text"
					id="address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					onBlur={() => handleBlur('address')}
					className={inputClasses('address')}
					placeholder="Via Roma 123"
					disabled={isLoading}
					required
				/>
				{errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
			</div>

			{/* City and Postal Code Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
						Città *
					</label>
					<input
						type="text"
						id="city"
						name="city"
						value={formData.city}
						onChange={handleChange}
						onBlur={() => handleBlur('city')}
						className={inputClasses('city')}
						disabled={isLoading}
						required
					/>
					{errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
				</div>

				<div>
					<label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-2">
						CAP *
					</label>
					<input
						type="text"
						id="postalCode"
						name="postalCode"
						value={formData.postalCode}
						onChange={handleChange}
						onBlur={() => handleBlur('postalCode')}
						className={inputClasses('postalCode')}
						placeholder="00100"
						maxLength={5}
						disabled={isLoading}
						required
					/>
					{errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
				</div>
			</div>

			{/* Country */}
			<div>
				<label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
					Paese *
				</label>
				<input
					type="text"
					id="country"
					name="country"
					value={formData.country}
					onChange={handleChange}
					onBlur={() => handleBlur('country')}
					className={inputClasses('country')}
					disabled={isLoading}
					required
				/>
				{errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
			</div>

			{/* Notes (Optional) */}
			<div>
				<label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-2">
					Note Aggiuntive (opzionale)
				</label>
				<textarea
					id="notes"
					name="notes"
					value={formData.notes}
					onChange={handleChange}
					rows={3}
					className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors"
					placeholder="Istruzioni speciali per la consegna..."
					disabled={isLoading}
				/>
			</div>

			{/* Payment Method */}
			<div>
				<label className="block text-sm font-medium text-neutral-700 mb-3">
					Metodo di Pagamento *
				</label>
				<div className="space-y-3">
					<label className="flex items-center p-4 border border-neutral-300 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
						<input
							type="radio"
							name="paymentMethod"
							value="card"
							checked={paymentMethod === 'card'}
							onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
							className="mr-3"
							disabled={isLoading}
						/>
						<div className="flex-1">
							<span className="font-medium">Carta di Credito/Debito</span>
							<p className="text-sm text-neutral-500">Visa, Mastercard, Amex</p>
						</div>
						<svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
						</svg>
					</label>

					<label className="flex items-center p-4 border border-neutral-300 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
						<input
							type="radio"
							name="paymentMethod"
							value="paypal"
							checked={paymentMethod === 'paypal'}
							onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
							className="mr-3"
							disabled={isLoading}
						/>
						<div className="flex-1">
							<span className="font-medium">PayPal</span>
							<p className="text-sm text-neutral-500">Paga in sicurezza con PayPal</p>
						</div>
						<svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
							<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
						</svg>
					</label>

					<label className="flex items-center p-4 border border-neutral-300 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
						<input
							type="radio"
							name="paymentMethod"
							value="bank-transfer"
							checked={paymentMethod === 'bank-transfer'}
							onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
							className="mr-3"
							disabled={isLoading}
						/>
						<div className="flex-1">
							<span className="font-medium">Bonifico Bancario</span>
							<p className="text-sm text-neutral-500">Ordine confermato dopo la ricezione del pagamento</p>
						</div>
						<svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
							<path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6zM2 22h20v-2H2z" />
						</svg>
					</label>
				</div>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-neutral-900 text-white py-4 px-6 rounded-md font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
			>
				{isLoading ? (
					<>
						<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Elaborazione in corso...</span>
					</>
				) : (
					<>
						<span>Completa Ordine</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="5" y1="12" x2="19" y2="12"/>
							<polyline points="12 5 19 12 12 19"/>
						</svg>
					</>
				)}
			</button>

			<p className="text-xs text-center text-neutral-500">
				Completando l'ordine accetti i nostri Termini di Servizio e la Privacy Policy
			</p>
		</form>
	);
}
