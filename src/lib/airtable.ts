// AirTable API client for fetching products

interface AirTableProduct {
	id: string;
	createdTime: string;
	fields: {
		Name?: string;
		Prezzo?: number;
		Descrizione?: string;
		Immagini?: Array<{ url: string }>;
		Categoria?: string;
		Taglie?: string[];
		InStock?: boolean;
	};
}

interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	images: string[];
	category: string;
	sizes: string[];
	inStock: boolean;
}

// Environment variables
const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME || 'Prodotti';

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// Helper to safely access localStorage
function getCache(): { data: Product[]; timestamp: number } | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const cached = localStorage.getItem('denif-products-cache');
		if (!cached) return null;
		return JSON.parse(cached);
	} catch {
		return null;
	}
}

function setCache(data: Product[]): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			'denif-products-cache',
			JSON.stringify({
				data,
				timestamp: Date.now(),
			})
		);
	} catch {
		// Ignore cache errors
	}
}

// Fetch products from AirTable
export async function fetchProducts(): Promise<Product[]> {
	// Check cache first (browser only)
	const cached = getCache();
	if (cached) {
		const age = Date.now() - cached.timestamp;
		if (age < CACHE_DURATION) {
			console.log('Using cached products');
			return cached.data;
		}
	}

	// If no AirTable credentials, return mock data
	if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		console.warn('AirTable credentials not configured, using mock data');
		return getMockProducts();
	}

	try {
		const response = await fetch(
			`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
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
		const products = transformAirTableData(data.records);

		// Cache the results (browser only)
		setCache(products);

		return products;
	} catch (error) {
		console.error('Error fetching products from AirTable:', error);
		// Return cached data if available, otherwise mock data
		if (cached) {
			return cached.data;
		}
		return getMockProducts();
	}
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
	const products = await fetchProducts();
	return products.find((p) => p.id === id) || null;
}

// Transform AirTable data to our Product format
function transformAirTableData(records: AirTableProduct[]): Product[] {
	return records
		.filter((record) => record.fields.Name) // Only include records with a name
		.map((record) => ({
			id: record.id,
			name: record.fields.Name || '',
			price: record.fields.Prezzo || 0,
			description: record.fields.Descrizione || '',
			images: record.fields.Immagini?.map((img) => img.url) || ['/placeholder-product.svg'],
			category: record.fields.Categoria || 'Scarpe',
			sizes: record.fields.Taglie || ['36', '37', '38', '39', '40', '41', '42'],
			inStock: record.fields.InStock !== false, // Default to true unless explicitly false
		}));
}

// Mock products for development/testing
function getMockProducts(): Product[] {
	return [
		{
			id: '1',
			name: 'Décolleté Classica in Pelle',
			price: 280,
			description: 'Elegante décolleté realizzata a mano in pelle italiana di prima qualità. Tacco 7cm, suola in cuoio lavorato a mano.',
			images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80'],
			category: 'Décolleté',
			sizes: ['36', '37', '38', '39', '40', '41'],
			inStock: true,
		},
		{
			id: '2',
			name: 'Sandalo Artigianale',
			price: 240,
			description: 'Sandalo in morbida pelle con fibbia decorativa artigianale. Suola in cuoio naturale con pantofola in sughero.',
			images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80'],
			category: 'Sandali',
			sizes: ['36', '37', '38', '39', '40'],
			inStock: true,
		},
		{
			id: '3',
			name: 'Mocassino in Pelle Scamosciata',
			price: 320,
			description: 'Mocassino tradizionale in pregiata pelle scamosciata. Dettagli a mano con pulisciScarpe argentato.',
			images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80'],
			category: 'Mocassini',
			sizes: ['38', '39', '40', '41', '42', '43'],
			inStock: true,
		},
		{
			id: '4',
			name: 'Stivaletto Invernale',
			price: 380,
			description: 'Stivaletto in pelle pieno fiore con doppia zip. Interno in pelliccia sintetica ecologica, suola in gomma antiscivolo.',
			images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
			category: 'Stivaletti',
			sizes: ['36', '37', '38', '39', '40', '41'],
			inStock: true,
		},
		{
			id: '5',
			name: 'Francesina Classica',
			price: 350,
			description: 'Francesina elegante in pelle italiana con punta leggermente allacciata. Ideale per cerimonie e occasioni speciali.',
			images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80'],
			category: 'Francesine',
			sizes: ['36', '37', '38', '39', '40', '41', '42'],
			inStock: true,
		},
		{
			id: '6',
			name: 'Sneaker in Pelle e Canvas',
			price: 220,
			description: 'Sneaker moderna in pelle e canvas con dettagli a mano. Suola in gomma leggera, perfetta per il tempo libero.',
			images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&q=80'],
			category: 'Sneakers',
			sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
			inStock: true,
		},
		{
			id: '7',
			name: 'Décolleté con Talto Alto',
			price: 320,
			description: 'Décolleté elegante con tacco 10cm in pelle verniciata. Perfetta per occasioni speciali.',
			images: ['https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=500&q=80'],
			category: 'Décolleté',
			sizes: ['36', '37', '38', '39', '40'],
			inStock: true,
		},
		{
			id: '8',
			name: 'Stringata Oxford Classica',
			price: 360,
			description: 'Oxford classica in pelle italiana conciata al vegetale. Suola in cuoio con cuciture a vista.',
			images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80'],
			category: 'Stringate',
			sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
			inStock: true,
		},
		{
			id: '9',
			name: 'Ciabatta da Camera',
			price: 180,
			description: 'Ciabatta confortevole in morbida pelle con suola in cuoio. Ideale per il relax.',
			images: ['https://images.unsplash.com/photo-1518976084612-270e3b744c5f?w=500&q=80'],
			category: 'Ciabatte',
			sizes: ['36', '37', '38', '39', '40', '41'],
			inStock: true,
		},
		{
			id: '10',
			name: 'Anfibio in Pelle',
			price: 420,
			description: 'Anfibio robusto in pelle pieno fiore con lacci laterali. Suola in cuoio antiscivolo.',
			images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80'],
			category: 'Stivaletti',
			sizes: ['37', '38', '39', '40', '41', '42', '43'],
			inStock: false,
		},
	];
}

// Filter products by category
export function filterByCategory(products: Product[], category: string): Product[] {
	if (!category || category === 'all') return products;
	return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

// Filter products by size
export function filterBySize(products: Product[], size: string): Product[] {
	if (!size || size === 'all') return products;
	return products.filter((p) => p.sizes.includes(size));
}

// Filter products by in-stock status
export function filterInStock(products: Product[]): Product[] {
	return products.filter((p) => p.inStock);
}

// Search products by name or description
export function searchProducts(products: Product[], query: string): Product[] {
	const searchTerm = query.toLowerCase();
	return products.filter(
		(p) =>
			p.name.toLowerCase().includes(searchTerm) ||
			p.description.toLowerCase().includes(searchTerm)
	);
}
