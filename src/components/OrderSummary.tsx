import type { CartItem } from '../lib/types';

interface OrderSummaryProps {
	items: CartItem[];
	subtotal: number;
	shipping: number;
	total: number;
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
	return (
		<div className="bg-neutral-50 p-6 rounded-lg sticky top-24">
			<h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
				Riepilogo Ordine
			</h3>

			{/* Items List */}
			<div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
				{items.map((item, index) => (
					<div key={`${item.id}-${item.size}-${index}`} className="flex items-center space-x-4">
						<img
							src={item.image}
							alt={item.name}
							className="w-16 h-16 object-cover rounded-md border border-neutral-200"
						/>
						<div className="flex-1 min-w-0">
							<h4 className="text-sm font-medium truncate">{item.name}</h4>
							<p className="text-xs text-neutral-500">Taglia: {item.size}</p>
							<p className="text-xs text-neutral-500">Qtà: {item.quantity}</p>
						</div>
						<p className="text-sm font-semibold whitespace-nowrap">
							€{(item.price * item.quantity).toFixed(2)}
						</p>
					</div>
				))}
			</div>

			{/* Divider */}
			<div className="border-t border-neutral-200 pt-4 space-y-3">
				{/* Subtotal */}
				<div className="flex justify-between text-sm">
					<span className="text-neutral-600">Subtotale</span>
					<span className="font-medium">€{subtotal.toFixed(2)}</span>
				</div>

				{/* Shipping */}
				<div className="flex justify-between text-sm">
					<span className="text-neutral-600">Spedizione</span>
					{shipping === 0 ? (
						<span className="font-medium text-green-600">Gratis</span>
					) : (
						<span className="font-medium">€{shipping.toFixed(2)}</span>
					)}
				</div>

				{/* Divider */}
				<div className="border-t border-neutral-200 pt-3">
					<div className="flex justify-between">
						<span className="font-semibold text-lg">Totale</span>
						<span className="font-bold text-lg text-neutral-900">€{total.toFixed(2)}</span>
					</div>
				</div>
			</div>

			{/* Free Shipping Notice */}
			{shipping === 0 && (
				<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
					<div className="flex items-start space-x-2">
						<svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<p className="text-sm text-green-800">
							Hai diritto alla <strong>spedizione gratuita!</strong>
						</p>
					</div>
				</div>
			)}

			{/* Delivery Estimate */}
			<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
				<div className="flex items-start space-x-2">
					<svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
					</svg>
					<div className="text-sm text-blue-800">
						<p className="font-medium">Consegna stimata: 3-5 giorni lavorativi</p>
						<p className="text-xs text-blue-600 mt-1">Spedizione tracciata in tutta Italia</p>
					</div>
				</div>
			</div>

			{/* Secure Checkout Badge */}
			<div className="mt-6 flex items-center justify-center space-x-2 text-xs text-neutral-500">
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
				</svg>
				<span>Pagamento sicuro e criptato</span>
			</div>
		</div>
	);
}
