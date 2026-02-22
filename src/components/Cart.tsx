import { useEffect, useState } from 'react';

interface CartItem {
	id: string;
	name: string;
	price: number;
	image: string;
	size: string;
	quantity: number;
}

export default function Cart() {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	// Load cart from localStorage
	useEffect(() => {
		loadCart();
	}, []);

	// Listen for cart button clicks
	useEffect(() => {
		const handleCartButtonClick = () => setIsOpen(true);

		document.querySelectorAll('[id^="cart-button"]').forEach((btn) => {
			btn.addEventListener('click', handleCartButtonClick);
		});

		return () => {
			document.querySelectorAll('[id^="cart-button"]').forEach((btn) => {
				btn.removeEventListener('click', handleCartButtonClick);
			});
		};
	}, []);

	const loadCart = () => {
		try {
			const stored = localStorage.getItem('denif-cart');
			if (stored) {
				setCart(JSON.parse(stored));
			}
		} catch {
			// Ignore errors
		}
		updateCartUI();
	};

	const saveCart = (newCart: CartItem[]) => {
		try {
			localStorage.setItem('denif-cart', JSON.stringify(newCart));
		} catch {
			// Ignore errors
		}
		setCart(newCart);
		updateCartUI();
	};

	const updateCartUI = () => {
		const cartCounts = document.querySelectorAll('[id^="cart-count"]');
		const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
		cartCounts.forEach((count: Element) => {
			if (totalItems > 0) {
				count.textContent = String(totalItems);
				count.classList.remove('hidden');
			} else {
				count.classList.add('hidden');
			}
		});
	};

	const addToCart = (item: Omit<CartItem, 'quantity'>) => {
		setCart((prevCart) => {
			const existingIndex = prevCart.findIndex(
				(i) => i.id === item.id && i.size === item.size
			);

			let newCart: CartItem[];
			if (existingIndex >= 0) {
				newCart = [...prevCart];
				newCart[existingIndex].quantity++;
			} else {
				newCart = [...prevCart, { ...item, quantity: 1 }];
			}

			saveCart(newCart);
			setIsOpen(true);
			return newCart;
		});
	};

	const updateQuantity = (index: number, delta: number) => {
		setCart((prevCart) => {
			const newCart = [...prevCart];
			if (newCart[index].quantity + delta <= 0) {
				newCart.splice(index, 1);
			} else {
				newCart[index].quantity += delta;
			}
			saveCart(newCart);
			return newCart;
		});
	};

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Make addToCart available globally
	useEffect(() => {
		(window as any).addToCart = addToCart;
	}, [cart]);

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Cart Panel */}
			<div
				className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-neutral-200 p-4">
					<h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
						Carrello
					</h2>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
						aria-label="Chiudi carrello"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" x2="6" y1="6" y2="18"/>
							<line x1="6" x2="18" y1="6" y2="18"/>
						</svg>
					</button>
				</div>

				{/* Cart Items */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{cart.length === 0 ? (
						<p className="text-center text-neutral-500 py-8">Il carrello è vuoto</p>
					) : (
						cart.map((item, index) => (
							<div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 border-b border-neutral-100 pb-4">
								<img
									src={item.image}
									alt={item.name}
									className="w-20 h-20 object-cover rounded-md"
								/>
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-medium truncate">{item.name}</h4>
									<p className="text-sm text-neutral-500">Taglia: {item.size}</p>
									<p className="text-sm font-semibold">€{item.price.toFixed(2)}</p>
								</div>
								<div className="flex items-center space-x-2">
									<button
										onClick={() => updateQuantity(index, -1)}
										className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
									>
										−
									</button>
									<span className="w-8 text-center">{item.quantity}</span>
									<button
										onClick={() => updateQuantity(index, 1)}
										className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
									>
										+
									</button>
								</div>
							</div>
						))
					)}
				</div>

				{/* Footer */}
				{cart.length > 0 && (
					<div className="border-t border-neutral-200 p-4 space-y-4">
						<div className="flex items-center justify-between">
							<span className="font-medium">Totale</span>
							<span className="text-xl font-semibold">€{total.toFixed(2)}</span>
						</div>
						<a
							href="/checkout"
							className="block w-full bg-neutral-900 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-neutral-800 transition-colors"
						>
							Procedi al Checkout
						</a>
						<p className="text-xs text-center text-neutral-500">
							Pagamenti sicuri
						</p>
						<p className="text-xs text-center text-neutral-400">
							oppure{' '}
							<a
								href={`https://wa.me/39XXXXXXXXXX?text=${encodeURIComponent(
									`Ciao! Vorrei ordinare:\n\n${cart.map(item =>
										`${item.name} (Taglia: ${item.size}) - ${item.quantity}x - €${(item.price * item.quantity).toFixed(2)}`
									).join('\n')}\n\nTotale: €${total.toFixed(2)}`
								)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-neutral-600"
							>
								ordina via WhatsApp
							</a>
						</p>
					</div>
				)}
			</div>
		</>
	);
}
