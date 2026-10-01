import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Heart, MapPin, Minus, Plus, ShieldCheck, Sparkles, Trash2, Truck } from "lucide-react";
import { request, money } from "./api";
import { itemKey, useCart } from "./cart";
import { AdminApp } from "./admin/AdminApp";
import { Category, Order, Product, StoreSettings } from "./types";
import { DEFAULT_ADDRESS, DEFAULT_PHONE, DEFAULT_WHATSAPP, mapsLink, phoneLink, whatsappLink } from "./storeDetails";
import { EmptyState, ErrorNotice, Footer, Header, HeroBanner, LoadingState, ProductCard, SectionHeading } from "./components/Storefront";
import { StoreImage } from "./components/StoreImage";

const FALLBACK_STORE: StoreSettings = {
  shopName: "SABA READYMADE",
  ownerName: "Mr. MD Jawed Equbal",
  phone: DEFAULT_PHONE,
  whatsapp: DEFAULT_WHATSAPP,
  address: DEFAULT_ADDRESS,
  description: "Everyday fashion for the whole family. Thoughtful styles and friendly prices.",
  websiteCredit: "Mr. Amber Rehan",
  announcement: "Fresh styles. Lovely prices. Made for you.",
  heroTitle: "Find your everyday\nfavorite.",
  heroSubtitle: "Thoughtful styles for every version of you.",
  heroImageUrl: ""
};

function PageShell({ settings, children }: { settings: StoreSettings | null; children: React.ReactNode }) {
  return <><Header shopName={settings?.shopName} ownerName={settings?.ownerName} announcement={settings?.announcement} /><main>{children}</main><Footer settings={settings} /></>;
}

function ProductGrid({ products, emptyText = "Try another search or explore a category you love." }: { products: Product[]; emptyText?: string }) {
  if (!products.length) return <div className="inline-empty"><Sparkles size={20} /><span>{emptyText}</span></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

function HomePage({ settings, categories }: { settings: StoreSettings | null; categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const refresh = () => {
    setLoading(true);
    request<Product[]>("/products").then(setProducts).catch((err: Error) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(refresh, []);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);
  const offers = products.filter((product) => product.offer).slice(0, 4);
  const categoryImages: Record<string, string> = {
    "Men's Wear": "photo-1516257984-b1b4d707412e", "Women's Wear": "photo-1483985988355-763728e1935b",
    "Kids Wear": "photo-1519238263530-99bdd11df2ea", "Traditional Wear": "photo-1610030469983-98e550d6193c"
  };
  return <PageShell settings={settings}>
    <div className="home-page">
      <HeroBanner settings={settings} onShop={() => navigate("/shop")} />
      <div className="trust-strip"><div><Truck size={19} /><span><strong>Easy doorstep delivery</strong><small>Right to your door</small></span></div><div><ShieldCheck size={19} /><span><strong>Cash on delivery</strong><small>Pay when it arrives</small></span></div><div><Sparkles size={19} /><span><strong>Handpicked styles</strong><small>For the whole family</small></span></div><div><Heart size={19} /><span><strong>Made for everyday</strong><small>Friendly service for every order</small></span></div></div>
      <section className="category-section page-container" id="categories">
        <SectionHeading eyebrow="A LITTLE SOMETHING FOR EVERYONE" title="Shop by mood." link="All categories" to="/shop" />
        <div className="category-grid">{categories.slice(0, 4).map((category, index) => <Link to={`/shop?category=${encodeURIComponent(category.slug)}`} className="category-tile" key={category.id}>
          <StoreImage src={category.imageUrl || `https://images.unsplash.com/${categoryImages[category.name] || ["photo-1521572163474-6864f9cf17ab", "photo-1551163943-3f6a855d1153", "photo-1503919005314-30d93d07d823", "photo-1610030469983-98e550d6193c"][index % 4]}?auto=format&fit=crop&w=600&q=80`} alt="" loading="lazy" />
          <div className="category-overlay"><span>0{index + 1} / STYLE EDIT</span><h3>{category.name}</h3><span className="category-arrow"><ArrowRight size={18} /></span></div>
        </Link>)}</div>
      </section>
      <section className="collection-section page-container" id="featured">
        <SectionHeading eyebrow="THE SABA EDIT" title="Well-loved, for a reason." link="Shop all styles" to="/shop" />
        {loading ? <LoadingState /> : error ? <ErrorNotice message={error} retry={refresh} /> : <ProductGrid products={featured} />}
      </section>
      <section className="story-banner page-container" id="offers">
        <div className="story-photo"><StoreImage src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1050&q=85" alt="Discover your new favorite looks" loading="lazy" /></div>
        <div className="story-copy"><span className="eyebrow"><span className="eyebrow-dot" /> GOOD STYLE, GOOD FEELING</span><h2>Looks you'll love.<br /><em>Prices you'll like.</em></h2><p>Meet the little outfit refresh your wardrobe's been waiting for. Thoughtful picks, lovely quality, easy prices.</p><Link to="/shop?offer=true" className="button button-light button-arrow">Explore special offers <ArrowRight size={16} /></Link></div>
        <span className="story-decoration">SABA<br />STYLE CLUB</span>
      </section>
      <section className="collection-section page-container" id="new-arrivals">
        <SectionHeading eyebrow="JUST LANDED" title="A fresh little something." link="See what's new" to="/shop?newArrival=true" />
        {loading ? <LoadingState /> : error ? <ErrorNotice message={error} retry={refresh} /> : <ProductGrid products={newArrivals} />}
      </section>
      <section className="offer-section page-container">
        <div className="offer-section-heading"><SectionHeading eyebrow="A GOOD TIME TO TREAT YOURSELF" title="Lovely finds, lovely prices." link="View all offers" to="/shop?offer=true" /></div>
        {loading ? <LoadingState /> : error ? <ErrorNotice message={error} retry={refresh} /> : <ProductGrid products={offers.slice(0, 4)} />}
      </section>
      <section className="closing-note"><span className="section-eyebrow">MADE FOR THE WAY YOU LIVE</span><h2>Get dressed. Feel good.<br /><em>That's the whole idea.</em></h2><Link to="/shop" className="text-link">Find your favorite <ArrowRight size={16} /></Link></section>
    </div>
  </PageShell>;
}

function ShopPage({ categories, settings }: { categories: Category[]; settings: StoreSettings | null }) {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const search = params.get("search") ?? "";
  const selectedCategory = params.get("category") ?? "all";
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [minDiscount, setMinDiscount] = useState(params.get("minDiscount") ?? "");
  const [size, setSize] = useState(params.get("size") ?? "");
  const [color, setColor] = useState(params.get("color") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");
  const [inStock, setInStock] = useState(params.get("inStock") === "true");
  const [offerOnly, setOfferOnly] = useState(params.get("offer") === "true");
  const newArrivalsOnly = params.get("newArrival") === "true";
  const filters = useMemo(() => new URLSearchParams({
    ...(search ? { search } : {}),
    ...(selectedCategory !== "all" ? { category: selectedCategory } : {}),
    ...(minPrice ? { minPrice } : {}),
    ...(maxPrice ? { maxPrice } : {}),
    ...(minDiscount ? { minDiscount } : {}),
    ...(size ? { size } : {}),
    ...(color ? { color } : {}),
    ...(inStock ? { inStock: "true" } : {}),
    ...(offerOnly ? { offer: "true" } : {}),
    ...(newArrivalsOnly ? { newArrival: "true" } : {}),
    sort
  }), [search, selectedCategory, minPrice, maxPrice, minDiscount, size, color, inStock, offerOnly, newArrivalsOnly, sort]);

  useEffect(() => {
    setLoading(true);
    setError("");
    request<Product[]>(`/products?${filters.toString()}`).then(setProducts).catch((err: Error) => setError(err.message)).finally(() => setLoading(false));
  }, [filters]);

  function updateCategory(category: string) {
    const next = new URLSearchParams(params);
    if (category === "all") next.delete("category"); else next.set("category", category);
    setParams(next);
  }
  function clearFilters() {
    setMinPrice(""); setMaxPrice(""); setMinDiscount(""); setSize(""); setColor(""); setInStock(false); setOfferOnly(false); setSort("newest");
    setParams(search ? { search } : newArrivalsOnly ? { newArrival: "true" } : {});
  }

  return <PageShell settings={settings}>
    <div className="shop-page page-container">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Shop</span></div>
      <div className="shop-title-row"><div><span className="section-eyebrow">FIND YOUR EVERYDAY FAVORITE</span><h1>{search ? `Looking for “${search}”` : offerOnly ? "A little something on offer." : "The good stuff."}</h1><p>Easy-to-love styles, picked just for you.</p></div><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="popular">Most loved</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="discount">Biggest savings</option></select></label></div>
      <div className="shop-layout">
        <aside className="filter-sidebar">
          <div className="filter-heading"><strong>Make it yours</strong><button onClick={clearFilters}>Clear all</button></div>
          <div className="filter-group"><h3>Categories</h3><button className={selectedCategory === "all" ? "filter-category active" : "filter-category"} onClick={() => updateCategory("all")}>All styles</button>{categories.map((category) => <button className={selectedCategory === category.slug ? "filter-category active" : "filter-category"} key={category.id} onClick={() => updateCategory(category.slug)}>{category.name}</button>)}</div>
          <div className="filter-group"><h3>Price range (₹)</h3><div className="price-filter"><input type="number" min="0" placeholder="From" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /><span>—</span><input type="number" min="0" placeholder="To" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></div></div>
          <div className="filter-group"><h3>Discount</h3><select className="filter-select" value={minDiscount} onChange={(event) => setMinDiscount(event.target.value)}><option value="">Any discount</option><option value="10">10% or more</option><option value="20">20% or more</option><option value="30">30% or more</option></select></div>
          <div className="filter-group"><h3>Size</h3><select className="filter-select" value={size} onChange={(event) => setSize(event.target.value)}><option value="">Any size</option>{["XS", "S", "M", "L", "XL", "XXL", "XXXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y", "14-15Y", "30", "32", "34", "36", "38", "Free Size"].map((value) => <option key={value}>{value}</option>)}</select></div>
          <div className="filter-group"><h3>Color</h3><select className="filter-select" value={color} onChange={(event) => setColor(event.target.value)}><option value="">Any color</option>{["Midnight", "Sand", "Black", "White", "Red", "Blue", "Navy Blue", "Sky Blue", "Royal Blue", "Green", "Olive Green", "Dark Green", "Yellow", "Mustard", "Orange", "Pink", "Light Pink", "Purple", "Lavender", "Maroon", "Burgundy", "Brown", "Beige", "Cream", "Grey", "Charcoal", "Teal", "Multicolour", "Khaki", "Gold"].map((value) => <option key={value}>{value}</option>)}</select></div>
          <label className="filter-check"><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} /> In stock only</label>
          <label className="filter-check"><input type="checkbox" checked={offerOnly} onChange={(event) => setOfferOnly(event.target.checked)} /> On offer</label>
        </aside>
        <div className="shop-results"><div className="results-count"><span>{loading ? "Looking around..." : `${products.length} thoughtful ${products.length === 1 ? "find" : "finds"}`}</span><button className="mobile-filter-button" onClick={() => document.querySelector(".filter-sidebar")?.classList.toggle("filters-open")}>Filters <ChevronDown size={14} /></button></div>{error ? <ErrorNotice message={error} /> : loading ? <LoadingState /> : <ProductGrid products={products} emptyText="No styles match just yet. Try a different filter." />}</div>
      </div>
    </div>
  </PageShell>;
}

function ProductPage({ settings }: { settings: StoreSettings | null }) {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setLoading(true); setError("");
    request<Product>(`/products/${encodeURIComponent(slug)}`).then((result) => {
      setProduct(result); setImage(result.imageUrl); setSize(result.sizes[0] ?? "Free Size"); setColor(result.colors[0] ?? "Default");
      return request<Product[]>(`/products?category=${encodeURIComponent(result.category?.slug ?? "")}`);
    }).then((items) => setRelated(items.filter((item) => item.slug !== slug).slice(0, 4)))
      .catch((err: Error) => setError(err.message)).finally(() => setLoading(false));
  }, [slug]);
  if (loading) return <PageShell settings={settings}><LoadingState /></PageShell>;
  if (error || !product) return <PageShell settings={settings}><div className="page-container"><ErrorNotice message={error || "Product not found."} /><Link className="text-link" to="/shop">Back to shop <ArrowRight size={15} /></Link></div></PageShell>;
  const available = product.stock > 0;
  function addToBag(buyNow = false) {
    add(product!, size, color, quantity);
    if (buyNow) navigate("/checkout"); else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <PageShell settings={settings}>
    <div className="product-detail-page page-container">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span></div>
      <div className="product-detail">
        <div className="detail-gallery"><div className="detail-thumbnails">{(product.images.length ? product.images : [product.imageUrl]).map((src, index) => <button className={image === src ? "active" : ""} key={`${src}-${index}`} onClick={() => setImage(src)}><StoreImage src={src} alt={`${product.name} view ${index + 1}`} /></button>)}</div><div className="detail-main-image"><StoreImage src={image || product.imageUrl} alt={product.name} />{product.discountPercent > 0 && <span className="discount-badge">{product.discountPercent}% off</span>}</div></div>
        <div className="detail-copy"><span className="section-eyebrow">{product.category?.name ?? "SABA EDIT"} · {product.brand}</span><h1>{product.name}</h1><div className="detail-rating"><span className="rating-chip"><span>★</span> {product.rating.toFixed(1)}</span><span>{product.reviewCount} kind reviews</span></div>
          <div className="detail-price"><strong>{money(product.sellingPrice)}</strong>{product.originalPrice > product.sellingPrice && <><del>{money(product.originalPrice)}</del><span>Save {money(product.originalPrice - product.sellingPrice)} ({product.discountPercent}%)</span></>}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-option"><div className="detail-option-heading"><strong>Choose a size</strong><span>Little things matter</span></div><div className="size-picker">{(product.sizes.length ? product.sizes : ["Free Size"]).map((option) => <button className={size === option ? "selected" : ""} key={option} onClick={() => setSize(option)}>{option}</button>)}</div></div>
          <div className="detail-option"><div className="detail-option-heading"><strong>Pick a color</strong><span>{color}</span></div><div className="color-picker">{(product.colors.length ? product.colors : ["Default"]).map((option, index) => <button className={color === option ? "selected" : ""} key={option} onClick={() => setColor(option)} style={{ "--swatch": ["#2c3342", "#d9cbb7", "#667f8d", "#845a5c", "#738169"][index % 5] } as React.CSSProperties} aria-label={option} title={option}><span /></button>)}</div></div>
          <div className="detail-option quantity-option"><strong>Quantity</strong><div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div><span className={`availability ${available ? "" : "unavailable"}`}>{available ? `${product.stock} ready to make your day` : "Out of stock"}</span></div>
          <div className="detail-actions"><button className="button button-dark" disabled={!available} onClick={() => addToBag()}>{available ? "Add to bag" : "Out of stock"}</button><button className="button button-outline" disabled={!available} onClick={() => addToBag(true)}>Buy now <ArrowRight size={16} /></button></div><div className="detail-delivery"><Truck size={18} /><span><strong>A little treat, delivered</strong><small>Cash on delivery · ₹99 delivery, free over ₹1,999</small></span></div>
        </div>
      </div>
      {related.length > 0 && <section className="related-products"><SectionHeading eyebrow="YOU MIGHT ALSO LOVE" title="Goes nicely with." /><ProductGrid products={related} /></section>}
    </div>
  </PageShell>;
}

function CartPage({ settings }: { settings: StoreSettings | null }) {
  const { items, subtotal, remove, setQuantity } = useCart();
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  return <PageShell settings={settings}><div className="page-container checkout-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Your bag</span></div><div className="cart-page-title"><div><span className="section-eyebrow">THE GOOD STUFF YOU PICKED</span><h1>Your bag<span className="title-dot">.</span></h1></div><span>{items.length} {items.length === 1 ? "style" : "styles"}</span></div>
    {!items.length ? <EmptyState title="Your bag's having a quiet moment." detail="A little browsing might find something just right." action={<Link className="button button-dark" to="/shop">Find a favorite <ArrowRight size={15} /></Link>} /> :
      <div className="cart-layout"><div className="cart-items">{items.map((item) => <article className="cart-item" key={itemKey(item)}><Link to={`/product/${item.productId}`} className="cart-item-image"><StoreImage src={item.imageUrl} alt={item.name} /></Link><div className="cart-item-main"><span className="section-eyebrow">{item.size} · {item.color}</span><Link to={`/product/${item.productId}`} className="cart-item-name">{item.name}</Link><div className="cart-line-prices"><strong>{money(item.price)}</strong>{item.originalPrice > item.price && <del>{money(item.originalPrice)}</del>}</div><div className="cart-item-controls"><div className="quantity-control"><button aria-label="Remove one" disabled={item.quantity <= 1} onClick={() => setQuantity(itemKey(item), item.quantity - 1)}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label="Add one" disabled={item.quantity >= item.stock} onClick={() => setQuantity(itemKey(item), item.quantity + 1)}><Plus size={13} /></button></div><button className="remove-item" onClick={() => remove(itemKey(item))}><Trash2 size={14} /> Remove</button></div></div><strong className="cart-line-total">{money(item.price * item.quantity)}</strong></article>)}
        <Link to="/shop" className="continue-shopping"><ArrowLeft size={15} /> Keep looking around</Link></div>
        <aside className="order-summary"><span className="section-eyebrow">A QUICK LITTLE RECAP</span><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{delivery ? money(delivery) : "On us"}</strong></div><div className="summary-free-note">{subtotal >= 1999 ? "Lovely! Your delivery is on us." : `Add ${money(Math.max(0, 1999 - subtotal))} more for free delivery.`}</div><div className="summary-total"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div><Link to="/checkout" className="button button-dark checkout-button">On to checkout <ArrowRight size={16} /></Link><p className="safe-checkout"><ShieldCheck size={15} /> No account needed. Ever.</p></aside>
      </div>}
  </div></PageShell>;
}

function CheckoutPage({ settings }: { settings: StoreSettings | null }) {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const orderPlaced = useRef(false);
  const delivery = subtotal >= 1999 ? 0 : 99;
  useEffect(() => { if (!items.length && !orderPlaced.current) navigate("/cart", { replace: true }); }, [items.length, navigate]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? "").trim(),
      mobile: String(form.get("mobile") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      state: String(form.get("state") ?? "").trim(),
      pinCode: String(form.get("pinCode") ?? "").trim(),
      items: items.map(({ productId, quantity, size, color }) => ({ productId, quantity, size, color }))
    };
    setBusy(true);
    try {
      const order = await request<Order>("/orders", { method: "POST", body: JSON.stringify(payload) });
      orderPlaced.current = true;
      clear();
      navigate("/order-confirmation", { state: { order } });
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <PageShell settings={settings}><div className="page-container checkout-page">
    <div className="breadcrumbs"><Link to="/cart">Your bag</Link><span>/</span><span>Delivery details</span></div><div className="cart-page-title"><div><span className="section-eyebrow">NO ACCOUNT. NO FUSS.</span><h1>Make it yours<span className="title-dot">.</span></h1></div><span>Guest checkout</span></div>
    {items.length > 0 && <div className="cart-layout checkout-layout"><form className="checkout-form" onSubmit={submit}><div className="form-card"><span className="section-eyebrow">01 · WHERE SHOULD WE SEND IT?</span><h2>Your delivery details</h2><div className="form-grid"><label className="full-field">Full name<input name="customerName" required minLength={2} maxLength={100} autoComplete="name" placeholder="How should we address you?" /></label><label>Mobile number<input name="mobile" required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} autoComplete="tel" placeholder="10-digit number" title="Enter a valid 10-digit Indian mobile number" /></label><label className="full-field">Delivery address<textarea name="address" required minLength={8} maxLength={300} autoComplete="street-address" placeholder="House number, street, and a helpful landmark" rows={3} /></label><label>City<input name="city" required minLength={2} autoComplete="address-level2" placeholder="City" /></label><label>State<input name="state" required minLength={2} autoComplete="address-level1" placeholder="State" /></label><label>PIN code<input name="pinCode" required pattern="[0-9]{6}" maxLength={6} inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" /></label></div></div><div className="payment-card"><span className="section-eyebrow">02 · NICE AND SIMPLE</span><h2>Payment</h2><div className="payment-method"><span className="payment-radio selected" /><span><strong>Cash on delivery</strong><small>Pay in cash when your order arrives</small></span><span className="cod-pill">COD</span></div></div>{error && <div className="form-error">{error}</div>}<button className="button button-dark place-order-button" type="submit" disabled={busy}>{busy ? "Placing your order..." : "Place my order"} {!busy && <ArrowRight size={17} />}</button><p className="checkout-reassurance"><ShieldCheck size={15} /> No account needed. Your details are only used to deliver this order.</p></form>
      <aside className="order-summary checkout-order-summary"><span className="section-eyebrow">03 · ALL THE LOVELY THINGS</span><h2>Your order</h2><div className="checkout-lines">{items.map((item) => <div className="checkout-line" key={itemKey(item)}><StoreImage src={item.imageUrl} alt="" /><div><strong>{item.name}</strong><small>{item.size} · {item.color} · Qty {item.quantity}</small></div><b>{money(item.price * item.quantity)}</b></div>)}</div><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{delivery ? money(delivery) : "On us"}</strong></div><div className="summary-total"><span>Total to pay</span><strong>{money(subtotal + delivery)}</strong></div><p className="safe-checkout"><Truck size={15} /> Free delivery on orders over ₹1,999</p></aside></div>}
  </div></PageShell>;
}

function ConfirmationPage({ settings }: { settings: StoreSettings | null }) {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;
  if (!order) {
    return <PageShell settings={settings}><div className="confirmation-page page-container">
      <span className="section-eyebrow">ORDER DETAILS AREN'T HERE</span>
      <h1>We couldn't load<br /><em>that confirmation.</em></h1>
      <p>For privacy, confirmation details aren't saved on this device. If you just placed an order, use its order ID and checkout mobile number to check its progress.</p>
      <div className="confirmation-actions"><Link to="/track" className="button button-dark">Track an order <ArrowRight size={16} /></Link><Link to="/shop" className="button button-outline">Back to the shop</Link></div>
    </div></PageShell>;
  }
  return <PageShell settings={settings}><div className="confirmation-page page-container">
    <div className="confirmation-check"><Check size={33} /></div><span className="section-eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h1>Order placed<br /><em>successfully!</em></h1><p>Thank you for choosing {settings?.shopName ?? "SABA READYMADE"}. We've got your order and are getting it ready with care.</p>
    <div className="confirmation-card"><div className="confirmation-order-id"><span>YOUR ORDER ID</span><strong>{order.orderNumber}</strong><span className="status-pill">{order.status}</span></div><div className="confirmation-address"><span className="section-eyebrow">DELIVERING TO</span><strong>{order.customerName}</strong><span>{order.address}, {order.city}, {order.state} {order.pinCode}</span><span>{order.mobile}</span></div><div className="confirmation-lines">{order.items.map((item) => <div className="checkout-line" key={item.id}><StoreImage src={item.imageUrl} alt="" /><div><strong>{item.productName}</strong><small>{item.size} · {item.color} · Qty {item.quantity}</small></div><b>{money(item.unitPrice * item.quantity)}</b></div>)}</div><div className="summary-line"><span>Delivery</span><strong>{order.deliveryFee ? money(order.deliveryFee) : "On us"}</strong></div><div className="summary-total"><span>Total · Cash on delivery</span><strong>{money(order.totalAmount)}</strong></div></div>
    <div className="confirmation-contact"><span>Need a hand? We're right here.</span>{phoneLink(settings?.phone ?? DEFAULT_PHONE) ? <a href={phoneLink(settings?.phone ?? DEFAULT_PHONE)!}>{settings?.phone ?? DEFAULT_PHONE}</a> : <span>{settings?.phone ?? DEFAULT_PHONE}</span>}</div><div className="confirmation-actions"><Link to="/shop" className="button button-dark">Keep exploring <ArrowRight size={16} /></Link><Link to="/track" className="button button-outline">Track this order</Link></div>
  </div></PageShell>;
}

function TrackingPage({ settings }: { settings: StoreSettings | null }) {
  const [order, setOrder] = useState<Pick<Order, "orderNumber" | "customerName" | "status" | "createdAt" | "items" | "totalAmount"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setOrder(null);
    const form = new FormData(event.currentTarget);
    try {
      setOrder(await request("/orders/track", { method: "POST", body: JSON.stringify({ orderNumber: form.get("orderNumber"), mobile: form.get("mobile") }) }));
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  const steps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  return <PageShell settings={settings}><div className="tracking-page page-container"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Track an order</span></div><div className="tracking-card"><span className="section-eyebrow">YOUR ORDER, RIGHT THIS WAY</span><h1>Where's my<br /><em>good stuff?</em></h1><p>Enter the order ID from your confirmation and the mobile number used at checkout.</p><form onSubmit={submit} className="tracking-form"><label>Order ID<input name="orderNumber" required placeholder="SBR-2026-12345678" /></label><label>Mobile number<input name="mobile" required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="10-digit number" /></label><button className="button button-dark" type="submit" disabled={busy}>{busy ? "Checking..." : "Find my order"} <ArrowRight size={16} /></button></form>{error && <div className="form-error">{error}</div>}
      {order && <div className="tracking-result"><div className="tracking-order-header"><div><span className="section-eyebrow">ORDER {order.orderNumber}</span><h2>Thanks, {order.customerName.split(" ")[0]}.</h2></div><span className="status-pill">{order.status}</span></div><div className="tracking-steps">{steps.map((step, index) => { const current = steps.indexOf(order.status); const complete = order.status === "Cancelled" ? false : index <= current; return <div className={`tracking-step ${complete ? "complete" : ""}`} key={step}><span className="step-dot">{complete ? <Check size={12} /> : index + 1}</span><span>{step}</span></div>; })}</div><div className="tracking-order-items">{order.items.map((item) => <div key={item.id}><span>{item.productName} · {item.size} · Qty {item.quantity}</span><strong>{money(item.unitPrice * item.quantity)}</strong></div>)}</div><div className="summary-total"><span>Order total</span><strong>{money(order.totalAmount)}</strong></div></div>}</div><p className="tracking-help">Need a hand? Call us at {phoneLink(settings?.phone ?? DEFAULT_PHONE) ? <a href={phoneLink(settings?.phone ?? DEFAULT_PHONE)!}>{settings?.phone ?? DEFAULT_PHONE}</a> : <span>{settings?.phone ?? DEFAULT_PHONE}</span>}.</p></div></PageShell>;
}

function ContactPage({ settings }: { settings: StoreSettings | null }) {
  const shop = settings ?? FALLBACK_STORE;
  const phone = phoneLink(shop.phone);
  const whatsapp = whatsappLink(shop.whatsapp);
  const map = mapsLink(shop.address);
  return <PageShell settings={settings}><div className="contact-page page-container"><span className="section-eyebrow">A REAL HELLO FROM A REAL SHOP</span><h1>We're right<br /><em>around the corner.</em></h1><p>Questions about a style, your order, or just want to say hello? Mr. Jawed and the team are happy to help.</p><div className="contact-cards"><div><span className="contact-icon">01</span><span className="section-eyebrow">COME BY</span><h2>Find our shop</h2><p>{shop.address}</p>{map ? <a className="text-link" target="_blank" rel="noreferrer" href={map}>Open Google Maps <ArrowRight size={15} /></a> : <span className="text-link">Google Maps location will be added soon</span>}</div><div><span className="contact-icon">02</span><span className="section-eyebrow">GIVE US A RING</span><h2>Let's talk</h2><p>Owner: {shop.ownerName}</p>{phone ? <a className="contact-phone" href={phone}>{shop.phone}</a> : <span>{shop.phone}</span>}{whatsapp ? <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowRight size={15} /></a> : <span className="text-link">WhatsApp number will be added soon</span>}</div><div className="contact-map"><MapPin size={27} /><strong>{shop.shopName}</strong><span>{map ? shop.address : "Shop location will be added soon"}</span>{map ? <a href={map} target="_blank" rel="noreferrer">Find us on the map ↗</a> : <span>Google Maps location will be added soon</span>}</div></div></div></PageShell>;
}

export default function App() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();
  useEffect(() => {
    request<StoreSettings>("/store").then(setSettings).catch((error: Error) => console.error("Store settings unavailable:", error.message));
    request<Category[]>("/categories").then(setCategories).catch((error: Error) => console.error("Categories unavailable:", error.message));
  }, []);
  if (location.pathname.startsWith("/admin")) return <AdminApp />;
  return <Routes>
    <Route path="/" element={<HomePage settings={settings} categories={categories} />} />
    <Route path="/shop" element={<ShopPage categories={categories} settings={settings} />} />
    <Route path="/product/:slug" element={<ProductPage settings={settings} />} />
    <Route path="/cart" element={<CartPage settings={settings} />} />
    <Route path="/checkout" element={<CheckoutPage settings={settings} />} />
    <Route path="/order-confirmation" element={<ConfirmationPage settings={settings} />} />
    <Route path="/track" element={<TrackingPage settings={settings} />} />
    <Route path="/contact" element={<ContactPage settings={settings} />} />
    <Route path="*" element={<PageShell settings={settings}><div className="page-container not-found"><span className="section-eyebrow">THIS PAGE TOOK A LITTLE DETOUR</span><h1>Nothing here<br /><em>but good taste.</em></h1><Link to="/" className="button button-dark">Back to the good stuff</Link></div></PageShell>} />
  </Routes>;
}
