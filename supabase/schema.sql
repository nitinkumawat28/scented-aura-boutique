-- Drop products and orders table if they exist to allow resetting the schema
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT,
    image TEXT,
    notes JSONB NOT NULL DEFAULT '{"top": [], "heart": [], "base": []}'::jsonb,
    stock INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow public write access for admin dashboard capability
CREATE POLICY "Allow public write access" 
ON public.products 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Seed premium Indian-inspired luxury products
INSERT INTO public.products (id, name, price, tagline, description, category, image, notes, stock, featured) VALUES
(
    'royal-oud',
    'Royal Oud',
    2999,
    'Warm woody fragrance',
    'A majestic blend of deep agarwood (oud) layered with velvety red rose and warm rich amber, evoking the timeless grandeur of royal palaces.',
    'Signature',
    'royal-oud',
    '{"top": ["Oud", "Saffron"], "heart": ["Rose", "Geranium"], "base": ["Amber", "Sandalwood"]}'::jsonb,
    45,
    true
),
(
    'kashmiri-saffron',
    'Kashmiri Saffron',
    3499,
    'Exotic spicy floral',
    'Deep saffron and golden honey from the valleys. An elegant composition of handpicked Kashmiri saffron steeped in warm wild honey and rich sandalwood.',
    'Exotic',
    'kashmiri-saffron',
    '{"top": ["Saffron", "Ginger"], "heart": ["Honey", "Jasmine"], "base": ["Sandalwood", "Patchouli"]}'::jsonb,
    30,
    true
),
(
    'mogra-absolute',
    'Mogra Absolute',
    2799,
    'Radiant white floral',
    'Night-blooming Indian jasmine and fresh greens. A rich, intoxicating bouquet of fresh Mogra flowers harvested at dusk, balanced with delicate white musk.',
    'Floral',
    'mogra-absolute',
    '{"top": ["Green Leaves", "Neroli"], "heart": ["Jasmine Mogra", "Tuberose"], "base": ["White Musk", "Cedarwood"]}'::jsonb,
    55,
    true
),
(
    'mysore-sandalwood',
    'Mysore Sandalwood',
    3899,
    'Rich creamy woody',
    'Sacred and grounding sandalwood with vanilla notes. Made with precious royal Mysore sandalwood, offering a smooth, creamy, woody aroma sweetened with vanilla.',
    'Woody',
    'mysore-sandalwood',
    '{"top": ["Cardamom", "Black Pepper"], "heart": ["Sandalwood", "Cedarwood"], "base": ["Vanilla Bourbon", "Amber"]}'::jsonb,
    25,
    true
),
(
    'darjeeling-tea',
    'Darjeeling Tea',
    2599,
    'Fresh citrus aromatic',
    'First flush black tea leaves and green bergamot. A refreshing and sophisticated aroma of freshly brewed black tea leaves mixed with bright, crisp Italian bergamot.',
    'Fresh',
    'darjeeling-tea',
    '{"top": ["Bergamot", "Lemon"], "heart": ["Black Tea", "Maté"], "base": ["Vetiver", "White Musk"]}'::jsonb,
    60,
    false
),
(
    'malabar-spice',
    'Malabar Spice',
    2899,
    'Warm exotic spicy',
    'Black pepper and fresh cardamom from the coast. A vibrant, energizing blend of sun-baked black peppercorns, green cardamom, and dry cedarwood.',
    'Spicy',
    'malabar-spice',
    '{"top": ["Black Pepper", "Coriander"], "heart": ["Cardamom", "Nutmeg"], "base": ["Cedarwood", "Patchouli"]}'::jsonb,
    40,
    false
),
(
    'monsoon-rain',
    'Monsoon Rain',
    2699,
    'Earthy fresh green',
    'The scent of first rain on sun-baked clay. Capture the ethereal petrichor scent of monsoon rain touching the earth, layered with grounding vetiver.',
    'Fresh',
    'monsoon-rain',
    '{"top": ["Rain Accord", "Bergamot"], "heart": ["Petrichor", "Green Leaves"], "base": ["Vetiver", "Patchouli"]}'::jsonb,
    35,
    false
),
(
    'varanasi-rose',
    'Varanasi Rose',
    3299,
    'Velvet floral chypre',
    'Heritage roses steeped in incense and patchouli. An ancient, mystical floral scent that pairs fresh, velvety Damask rose with spiritual temple incense.',
    'Signature',
    'varanasi-rose',
    '{"top": ["Damask Rose", "Bergamot"], "heart": ["Incense", "Myrrh"], "base": ["Patchouli", "Sandalwood"]}'::jsonb,
    50,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    items INTEGER NOT NULL DEFAULT 1,
    products JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to orders
CREATE POLICY "Allow public read access to orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Allow public write access to orders for customer checkout and admin dashboard
CREATE POLICY "Allow public write access to orders" 
ON public.orders 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Seed mock order history
INSERT INTO public.orders (id, customer, created_at, total, status, items, products) VALUES
('ORD-1092', 'Aarav Sharma', '2026-04-12 10:00:00+00', 10500, 'Delivered', 3, '[{"id": "varanasi-rose", "name": "Varanasi Rose", "price": 3500, "qty": 3, "size": "100ml"}]'::jsonb),
('ORD-1154', 'Priya Patel', '2026-05-02 12:30:00+00', 20500, 'Processing', 6, '[{"id": "kashmiri-saffron", "name": "Kashmiri Saffron", "price": 3500, "qty": 5, "size": "100ml"}, {"id": "royal-oud", "name": "Royal Oud", "price": 3000, "qty": 1, "size": "100ml"}]'::jsonb),
('ORD-1155', 'Rahul Verma', '2026-05-14 14:15:00+00', 15500, 'Shipped', 5, '[{"id": "mysore-sandalwood", "name": "Mysore Sandalwood", "price": 3100, "qty": 5, "size": "100ml"}]'::jsonb),
('ORD-1156', 'Neha Gupta', '2026-05-15 16:45:00+00', 32000, 'Pending', 3, '[{"id": "royal-oud", "name": "Royal Oud", "price": 10000, "qty": 1, "size": "100ml"}, {"id": "varanasi-rose", "name": "Varanasi Rose", "price": 11000, "qty": 1, "size": "100ml"}, {"id": "kashmiri-saffron", "name": "Kashmiri Saffron", "price": 11000, "qty": 1, "size": "100ml"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for products and orders tables
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;


