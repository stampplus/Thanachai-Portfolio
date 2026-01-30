-- THANAT-CHA Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- ========================================
-- PRODUCTS TABLE
-- ========================================
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text, -- Short mood description
  description text, -- Full story
  mood text not null, -- calm, warm, wild, fresh, deep
  top_notes text[],
  middle_notes text[],
  base_notes text[],
  images text[], -- Array of image URLs
  is_bestseller boolean default false,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table products enable row level security;

-- Create policy for public read access
create policy "Public can view active products"
  on products for select
  using (is_active = true);

-- Create policy for admin operations (insert/update/delete)
create policy "Admin can manage products"
  on products for all
  using (true)
  with check (true);

-- Create policy for anon role to view all products (for admin panel)
create policy "Anon can view all products"
  on products for select
  using (true);

-- ========================================
-- PRODUCT VARIANTS TABLE
-- ========================================
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  size text not null, -- 10ml, 30ml, 50ml
  price integer not null, -- Store in smallest unit (satang)
  stock integer default 0,
  sku text unique,
  is_active boolean default true
);

-- Enable RLS
alter table product_variants enable row level security;

-- Create policy for public read access
create policy "Public can view active variants"
  on product_variants for select
  using (is_active = true);

-- Create policy for admin operations
create policy "Admin can manage variants"
  on product_variants for all
  using (true)
  with check (true);

-- ========================================
-- ORDERS TABLE
-- ========================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null, -- TH-2025-00001
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  payment_method text not null, -- promptpay, bank_transfer
  payment_status text default 'pending', -- pending, paid, failed
  order_status text default 'pending', -- pending, confirmed, shipped, delivered, cancelled
  subtotal integer not null,
  shipping_cost integer default 0,
  total integer not null,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table orders enable row level security;

-- Create policy for admin operations
create policy "Admin can manage orders"
  on orders for all
  using (true)
  with check (true);

-- ========================================
-- ORDER ITEMS TABLE
-- ========================================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  product_name text not null, -- Snapshot
  variant_size text not null, -- Snapshot
  price integer not null, -- Snapshot
  quantity integer not null,
  total integer not null
);

-- Enable RLS
alter table order_items enable row level security;

-- Create policy for admin operations
create policy "Admin can manage order_items"
  on order_items for all
  using (true)
  with check (true);

-- ========================================
-- DISCOVERY SETS TABLE
-- ========================================
create table discovery_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null,
  images text[],
  included_product_ids uuid[],
  is_active boolean default true
);

-- Enable RLS
alter table discovery_sets enable row level security;

-- Create policy for public read access
create policy "Public can view active discovery sets"
  on discovery_sets for select
  using (is_active = true);

-- Create policy for admin operations
create policy "Admin can manage discovery_sets"
  on discovery_sets for all
  using (true)
  with check (true);

-- ========================================
-- REVIEWS TABLE
-- ========================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  is_approved boolean default false,
  created_at timestamp default now()
);

-- Enable RLS
alter table reviews enable row level security;

-- Create policy for public read access (only approved reviews)
create policy "Public can view approved reviews"
  on reviews for select
  using (is_approved = true);

-- Create policy for insert (anyone can submit a review)
create policy "Anyone can submit a review"
  on reviews for insert
  with check (true);

-- Create policy for admin operations
create policy "Admin can manage reviews"
  on reviews for all
  using (true)
  with check (true);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
create index idx_products_slug on products(slug);
create index idx_products_mood on products(mood);
create index idx_products_active on products(is_active);
create index idx_product_variants_product_id on product_variants(product_id);
create index idx_orders_status on orders(order_status);
create index idx_orders_phone on orders(customer_phone);
create index idx_order_items_order_id on order_items(order_id);
create index idx_reviews_product_id on reviews(product_id);
create index idx_reviews_approved on reviews(is_approved);

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample products
insert into products (slug, name, tagline, description, mood, top_notes, middle_notes, base_notes, is_bestseller) values
('after-rain', 'After Rain', 'The quiet after the storm', 'The quiet after the storm. Petrichor rising from warm earth. A window left open. For moments of clarity, stillness, and new beginnings.', 'calm', 
 ARRAY['Bergamot', 'Ozonic Accord'], 
 ARRAY['Wet Soil', 'Violet Leaf'], 
 ARRAY['Cedar', 'White Musk'], 
 true),

('midnight-tea', 'Midnight Tea', 'Conversations that lasted until dawn', 'A cup forgotten on the windowsill. Moonlight through steam. Conversations that lasted until dawn. For moments of intimacy, warmth, and quiet luxury.', 'warm',
 ARRAY['Black Tea', 'Cardamom'],
 ARRAY['Jasmine', 'Honey'],
 ARRAY['Sandalwood', 'Vanilla'],
 true),

('wild-orchid', 'Wild Orchid', 'Untamed beauty in the jungle mist', 'Dewdrops on petals at dawn. The hum of insects in the undergrowth. Nature unrestrained. For moments of adventure, sensuality, and wild freedom.', 'wild',
 ARRAY['Pink Pepper', 'Lychee'],
 ARRAY['Orchid', 'Peony'],
 ARRAY['Patchouli', 'Amber'],
 false);

-- Insert variants for After Rain
insert into product_variants (product_id, size, price, stock, sku) 
select id, '10ml', 49000, 20, 'AR-10ML' from products where slug = 'after-rain';

insert into product_variants (product_id, size, price, stock, sku)
select id, '30ml', 129000, 15, 'AR-30ML' from products where slug = 'after-rain';

insert into product_variants (product_id, size, price, stock, sku)
select id, '50ml', 189000, 10, 'AR-50ML' from products where slug = 'after-rain';

-- Insert variants for Midnight Tea
insert into product_variants (product_id, size, price, stock, sku)
select id, '10ml', 49000, 25, 'MT-10ML' from products where slug = 'midnight-tea';

insert into product_variants (product_id, size, price, stock, sku)
select id, '30ml', 129000, 18, 'MT-30ML' from products where slug = 'midnight-tea';

insert into product_variants (product_id, size, price, stock, sku)
select id, '50ml', 189000, 12, 'MT-50ML' from products where slug = 'midnight-tea';

-- Insert variants for Wild Orchid
insert into product_variants (product_id, size, price, stock, sku)
select id, '10ml', 49000, 5, 'WO-10ML' from products where slug = 'wild-orchid';

insert into product_variants (product_id, size, price, stock, sku)
select id, '30ml', 129000, 3, 'WO-30ML' from products where slug = 'wild-orchid';

insert into product_variants (product_id, size, price, stock, sku)
select id, '50ml', 189000, 2, 'WO-50ML' from products where slug = 'wild-orchid';
