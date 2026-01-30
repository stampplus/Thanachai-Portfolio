/**
 * THANAT-CHA Admin - Supabase Client
 * Database connection for admin operations
 */

// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY


// ========================================
// SUPABASE CLIENT
// ========================================

let supabaseClient = null;

/**
 * Initialize Supabase client
 */
function initSupabase() {
  if (supabaseClient) return supabaseClient;
  
  // Check if Supabase library is loaded
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded');
    return null;
  }
  
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

/**
 * Get Supabase client instance
 */
function getSupabase() {
  return supabaseClient || initSupabase();
}

// ========================================
// PRODUCT QUERIES
// ========================================

/**
 * Get all products with variants
 */
async function getAllProducts() {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  console.log('[DEBUG] Fetching products from Supabase...');
  
  const { data, error } = await supabase
    .from('products')
    .select(`*, product_variants(*)`)
    .order('created_at', { ascending: false });
  
  console.log('[DEBUG] Supabase response:', { data, error });
  
  if (error) {
    console.error('[DEBUG] Supabase error:', error);
    return { data: [], error: error.message };
  }
  
  if (!data || data.length === 0) {
    console.warn('[DEBUG] No products returned from Supabase');
  } else {
    console.log(`[DEBUG] Retrieved ${data.length} products`);
  }
  
  // Map product_variants to variants for consistency
  const productsWithVariants = data.map(product => ({
    ...product,
    variants: product.product_variants || []
  }));
  
  return { data: productsWithVariants, error: null };
}

/**
 * Get product by ID
 */
async function getProductById(id) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`*, product_variants(*)`)
    .eq('id', id)
    .single();
  
  if (error) return { data: null, error: error.message };
  
  return { data: { ...product, variants: product.product_variants || [] }, error: null };
}

/**
 * Create new product
 */
async function createProduct(productData) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { variants, ...product } = productData;
  
  // Check if slug already exists
  const { data: existingProduct } = await supabase
    .from('products')
    .select('id')
    .eq('slug', product.slug)
    .single();
  
  if (existingProduct) {
    return { data: null, error: 'A product with this slug already exists. Please use a different slug.' };
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) return { data: null, error: error.message };
  
  // Insert variants
  if (variants && variants.length > 0) {
    const variantsWithProductId = variants.map(v => ({
      ...v,
      product_id: data.id
    }));
    
    await supabase.from('product_variants').insert(variantsWithProductId);
  }
  
  return { data, error: null };
}

/**
 * Update product
 */
async function updateProduct(id, productData) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { variants, ...product } = productData;
  
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return { data: null, error: error.message };
  
  // Update variants
  if (variants) {
    // Delete existing variants
    await supabase.from('product_variants').delete().eq('product_id', id);
    
    // Insert new variants
    const variantsWithProductId = variants.map(v => ({
      ...v,
      product_id: id
    }));
    
    await supabase.from('product_variants').insert(variantsWithProductId);
  }
  
  return { data, error: null };
}

/**
 * Delete product
 */
async function deleteProduct(id) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

/**
 * Toggle product active status
 */
async function toggleProductActive(id, isActive) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

/**
 * Toggle bestseller status
 */
async function toggleBestseller(id, isBestseller) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('products')
    .update({ is_bestseller: isBestseller })
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

/**
 * Update variant stock
 */
async function updateVariantStock(variantId, stock) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('product_variants')
    .update({ stock })
    .eq('id', variantId);
  
  return { error: error ? error.message : null };
}

/**
 * Update variant price
 */
async function updateVariantPrice(variantId, price) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('product_variants')
    .update({ price })
    .eq('id', variantId);
  
  return { error: error ? error.message : null };
}

// ========================================
// ORDER QUERIES
// ========================================

/**
 * Get all orders
 */
async function getAllOrders(status = null) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('order_status', status);
  }
  
  const { data, error } = await query;
  
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

/**
 * Get order by ID with items
 */
async function getOrderById(id) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return { data: null, error: error.message };
  
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);
  
  return { data: { ...order, items: items || [] }, error: null };
}

/**
 * Update order status
 */
async function updateOrderStatus(id, status) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

// ========================================
// INVENTORY QUERIES
// ========================================

/**
 * Get low stock products (< 5)
 */
async function getLowStockProducts(threshold = 5) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('product_variants')
    .select(`
      *,
      products:product_id (*)
    `)
    .lt('stock', threshold)
    .order('stock', { ascending: true });
  
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

// ========================================
// ANALYTICS QUERIES
// ========================================

/**
 * Get analytics data for date range
 */
async function getAnalyticsData(dateFrom, dateTo) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };

  // Get orders in date range
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo + 'T23:59:59')
    .order('created_at', { ascending: true });

  if (ordersError) return { data: null, error: ordersError.message };

  // Get order items for product analytics
  const orderIds = orders.map(o => o.id);
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) return { data: null, error: itemsError.message };

  // Calculate summary
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const paidOrders = orders.filter(o => o.payment_status === 'paid').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group by date for daily breakdown
  const dailyMap = {};
  orders.forEach(order => {
    const date = order.created_at.split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { orders: 0, revenue: 0 };
    }
    dailyMap[date].orders++;
    dailyMap[date].revenue += order.total;
  });

  const dailyBreakdown = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    orders: data.orders,
    revenue: data.revenue,
    avgOrder: data.orders > 0 ? data.revenue / data.orders : 0
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by product for top products
  const productMap = {};
  orderItems.forEach(item => {
    if (!productMap[item.product_name]) {
      productMap[item.product_name] = { units_sold: 0, revenue: 0 };
    }
    productMap[item.product_name].units_sold += item.quantity;
    productMap[item.product_name].revenue += item.total;
  });

  const topProducts = Object.entries(productMap)
    .map(([product_name, data]) => ({ product_name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    data: {
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        paidOrders
      },
      dailyBreakdown,
      topProducts
    },
    error: null
  };
}

// ========================================
// REVIEW QUERIES
// ========================================

/**
 * Get all reviews (for admin)
 */
async function getAllReviews(status = null) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  let query = supabase
    .from('reviews')
    .select(`
      *,
      products:product_id (name, slug)
    `)
    .order('created_at', { ascending: false });
  
  if (status === 'pending') {
    query = query.eq('is_approved', false);
  } else if (status === 'approved') {
    query = query.eq('is_approved', true);
  }
  
  const { data, error } = await query;
  
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

/**
 * Get approved reviews for a product
 */
async function getProductReviews(productId) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

/**
 * Create a new review
 */
async function createReview(reviewData) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();
  
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * Approve a review
 */
async function approveReview(id) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

/**
 * Delete a review
 */
async function deleteReview(id) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

// ========================================
// DISCOVERY SET QUERIES
// ========================================

/**
 * Get all discovery sets
 */
async function getAllDiscoverySets() {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('discovery_sets')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

/**
 * Get discovery set by ID
 */
async function getDiscoverySetById(id) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('discovery_sets')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * Create discovery set
 */
async function createDiscoverySet(setData) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('discovery_sets')
    .insert([setData])
    .select()
    .single();
  
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * Update discovery set
 */
async function updateDiscoverySet(id, setData) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .from('discovery_sets')
    .update(setData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * Delete discovery set
 */
async function deleteDiscoverySet(id) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .from('discovery_sets')
    .delete()
    .eq('id', id);
  
  return { error: error ? error.message : null };
}

// ========================================
// STORAGE QUERIES
// ========================================

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(file, path) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Supabase not initialized' };
  
  const { data, error } = await supabase
    .storage
    .from('product-images')
    .upload(path, file);
  
  if (error) return { data: null, error: error.message };
  
  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(data.path);
  
  return { data: publicUrl, error: null };
}

/**
 * Delete image from Supabase Storage
 */
async function deleteImage(path) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not initialized' };
  
  const { error } = await supabase
    .storage
    .from('product-images')
    .remove([path]);
  
  return { error: error ? error.message : null };
}
