import type { PaymentMethod } from '../lib/types';

interface PaymentMethodSelectorProps {
	selected: PaymentMethod;
	onChange: (method: PaymentMethod) => void;
	disabled?: boolean;
}

interface PaymentOption {
	value: PaymentMethod;
	label: string;
	description: string;
	icon: string;
}

const paymentOptions: PaymentOption[] = [
	{
		value: 'card',
		label: 'Carta di Credito/Debito',
		description: 'Visa, Mastercard, Amex',
		icon: '💳',
	},
	{
		value: 'paypal',
		label: 'PayPal',
		description: 'Paga in sicurezza con PayPal',
		icon: '🔵',
	},
	{
		value: 'bank-transfer',
		label: 'Bonifico Bancario',
		description: 'Ordine confermato dopo la ricezione del pagamento',
		icon: '🏦',
	},
];

export default function PaymentMethodSelector({
	selected,
	onChange,
	disabled = false,
}: PaymentMethodSelectorProps) {
	return (
		<div>
			<label className="block text-sm font-medium text-neutral-700 mb-3">
				Metodo di Pagamento *
			</label>
			<div className="space-y-3">
				{paymentOptions.map((option) => (
					<label
						key={option.value}
						className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
							selected === option.value
								? 'border-neutral-900 bg-neutral-50'
								: 'border-neutral-300 hover:bg-neutral-50'
						}`}
					>
						<input
							type="radio"
							name="paymentMethod"
							value={option.value}
							checked={selected === option.value}
							onChange={(e) => onChange(e.target.value as PaymentMethod)}
							className="mr-3"
							disabled={disabled}
						/>
						<span className="text-2xl mr-3">{option.icon}</span>
						<div className="flex-1">
							<span className="font-medium block">{option.label}</span>
							<p className="text-sm text-neutral-500">{option.description}</p>
						</div>
						{selected === option.value && (
							<svg className="w-6 h-6 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
						)}
					</label>
				))}
			</div>
		</div>
	);
}
