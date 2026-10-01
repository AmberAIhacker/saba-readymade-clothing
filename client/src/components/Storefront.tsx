import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Heart, Menu, Search, ShoppingBag, Shirt, ShieldCheck, X, Star } from "lucide-react";
import { money } from "../api";
import { useCart } from "../cart";
import type { Product, StoreSettings } from "../types";
import { DEFAULT_ADDRESS, DEFAULT_PHONE, DEFAULT_WHATSAPP, mapsLink, phoneLink, whatsappLink } from "../storeDetails";
import { StoreImage } from "./StoreImage";

export function Header({ shopName = "SABA READYMADE", ownerName = "Mr. MD Jawed Equbal", announcement = "Fresh styles. Lovely prices. Made for you." }: { shopName?: string; ownerName?: string; announcement?: string }) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const navigate = useNavigate();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    navigate(`/shop${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
    setMenuOpen(false);
  }
  return <>
    <div className="announcement-bar"><span>{announcement}</span><span>Free delivery on orders over ₹1,999</span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Link to="/" className="brand-lockup" aria-label={`${shopName} home`}>
        <span className="brand-mark"><Shirt size={21} strokeWidth={1.65} /></span>
        <span><strong>{shopName}</strong><small>Owner: {ownerName}</small></span>
      </Link>
      <form className="search-box" onSubmit={submit}>
        <Search size={18} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find something you'll love..." aria-label="Search products" />
        <button type="submit">Search</button>
      </form>
      <div className={`header-actions ${menuOpen ? "is-open" : ""}`}>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink><NavLink to="/shop">Shop</NavLink><a href="/#categories" onClick={() => setMenuOpen(false)}>Categories</a><a href="/#new-arrivals" onClick={() => setMenuOpen(false)}>New in</a><a href="/#offers" onClick={() => setMenuOpen(false)}>Offers</a><a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <Link to="/cart" className="cart-link"><ShoppingBag size={19} /><span>Bag</span>{count > 0 && <span className="cart-count">{count}</span>}</Link>
        <Link to="/admin" className="admin-login-link" aria-label="Admin login" title="Admin login"><ShieldCheck size={18} /><span>Admin</span></Link>
      </div>
    </header>
  </>;
}

export function HeroBanner({ settings, onShop }: { settings: StoreSettings | null; onShop: () => void }) {
  return <section className="hero-banner">
    <div className="hero-copy">
      <span className="eyebrow"><span className="eyebrow-dot" /> THE NEW SEASON IS HERE</span>
      <h1>{(settings?.heroTitle || "Find your everyday\nfavorite.").split("\n").map((line, index) => <span key={index}>{line}{index === 0 && <br />}</span>)}</h1>
      <p>{settings?.heroSubtitle || "Thoughtful styles for every version of you. Discover easy-to-love looks at prices that feel just right."}</p>
      <button className="button button-dark button-arrow" onClick={onShop}>Explore the collection <ArrowRight size={17} /></button>
      <div className="hero-note"><div className="tiny-avatars"><span>✿</span><span>✦</span><span>♡</span></div><span>Made for the whole family</span></div>
    </div>
    <div className="hero-image-wrap">
      <StoreImage src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1300&q=90"} alt="The latest SABA READYMADE fashion collection" />
      <div className="hero-photo-tag"><span>NEW SEASON</span><strong>Good things<br />to wear.</strong></div>
      <div className="hero-side-caption">DARBGANGA · EST. WITH CARE</div>
    </div>
    <div className="hero-counter"><strong>01</strong><span>/</span><span>03</span></div>
  </section>;
}

export function SectionHeading({ eyebrow, title, link, to }: { eyebrow?: string; title: string; link?: string; to?: string }) {
  return <div className="section-heading">
    <div>{eyebrow && <div className="section-eyebrow">{eyebrow}</div>}<h2>{title}</h2></div>
    {link && <Link className="text-link" to={to ?? "/shop"}>{link} <ArrowRight size={16} /></Link>}
  </div>;
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [size, setSize] = useState(product.sizes[0] ?? "Free Size");
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const available = product.stock > 0;
  function addItem(buyNow = false) {
    add(product, size, color);
    if (buyNow) navigate("/checkout");
    else {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1400);
    }
  }
  return <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
    <div className="product-image-frame">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}><StoreImage src={product.imageUrl} alt={product.name} loading="lazy" /></Link>
      {product.discountPercent > 0 && <span className="discount-badge">{product.discountPercent}% off</span>}
      {product.newArrival && <span className="new-badge">Just in</span>}
      <button className={`wishlist-button ${saved ? "is-saved" : ""}`} aria-label={saved ? "Remove from saved items" : "Save item"} onClick={() => setSaved(!saved)}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      {!available && <div className="out-of-stock-label">Out of stock</div>}
      {available && <div className="image-quick-actions"><button onClick={() => addItem()}><ShoppingBag size={14} /> Quick add</button></div>}
    </div>
    <div className="product-card-content">
      <div className="product-category-line">{product.category?.name ?? "SABA EDIT"}</div>
      <Link className="product-name" to={`/product/${product.slug}`}>{product.name}</Link>
      <div className="product-price"><strong>{money(product.sellingPrice)}</strong>{product.originalPrice > product.sellingPrice && <><del>{money(product.originalPrice)}</del><span className="price-saved">Save {product.discountPercent}%</span></>}</div>
      {!compact && <div className="product-options">
        <label><span>Size</span><select value={size} onChange={(event) => setSize(event.target.value)} aria-label={`Choose size for ${product.name}`}>{(product.sizes.length ? product.sizes : ["Free Size"]).map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Color</span><select value={color} onChange={(event) => setColor(event.target.value)} aria-label={`Choose color for ${product.name}`}>{(product.colors.length ? product.colors : ["Default"]).map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>}
      <div className="product-card-bottom"><span className="rating-chip"><Star size={12} fill="currentColor" /> {product.rating.toFixed(1)} <span>({product.reviewCount})</span></span><span className="stock-note">{available ? `${product.stock} in stock` : "Sold out"}</span></div>
      {!compact && <div className="product-actions"><button className="button button-outline button-small" onClick={() => addItem()} disabled={!available}>{added ? <><Check size={15} /> Added</> : "Add to bag"}</button><button className="button button-dark button-small" onClick={() => addItem(true)} disabled={!available}>Buy now</button></div>}
    </div>
  </article>;
}

export function LoadingState({ label = "Finding the good stuff..." }: { label?: string }) {
  return <div className="loading-state"><span className="loading-spinner" />{label}</div>;
}

export function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) {
  return <div className="error-notice"><span>{message}</span>{retry && <button className="text-link" onClick={retry}>Try again</button>}</div>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><ShoppingBag size={26} /></div><h3>{title}</h3><p>{detail}</p>{action}</div>;
}

export function Footer({ settings }: { settings: StoreSettings | null }) {
  const shop = settings?.shopName ?? "SABA READYMADE";
  const phone = settings?.phone ?? DEFAULT_PHONE;
  const whatsapp = settings?.whatsapp ?? DEFAULT_WHATSAPP;
  const phoneHref = phoneLink(phone);
  const whatsappHref = whatsappLink(whatsapp);
  const mapHref = mapsLink(settings?.address ?? DEFAULT_ADDRESS);
  return <footer className="site-footer" id="contact">
    <div className="footer-main">
      <div className="footer-brand"><Link to="/" className="brand-lockup"><span className="brand-mark"><Shirt size={21} /></span><span><strong>{shop}</strong><small>STYLE FOR EVERY DAY</small></span></Link><p>{settings?.description ?? "Everyday fashion for the whole family. Thoughtful styles and friendly prices."}</p>{whatsappHref ? <a className="footer-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">Chat with us on WhatsApp <ArrowRight size={14} /></a> : <span className="footer-whatsapp">WhatsApp number to be added</span>}</div>
      <div className="footer-column"><h4>Explore</h4><Link to="/shop">Shop all</Link><a href="/#categories">Our categories</a><a href="/#new-arrivals">New arrivals</a><a href="/#offers">Special offers</a><Link to="/track">Track an order</Link></div>
      <div className="footer-column"><h4>Say hello</h4><p>{settings?.ownerName ?? "Mr. MD Jawed Equbal"}</p>{phoneHref ? <a href={phoneHref}>{phone}</a> : <span>{phone}</span>}<p>{settings?.address ?? DEFAULT_ADDRESS}</p>{mapHref ? <a href={mapHref} target="_blank" rel="noreferrer">Find us on Google Maps ↗</a> : <span>Google Maps location will be added soon</span>}</div>
      <div className="footer-newsletter"><span className="section-eyebrow">A LITTLE NOTE FROM US</span><h3>Good style.<br />Good mood.</h3><p>Thoughtful picks, fresh arrivals and little surprises — come see what feels like you.</p><Link to="/shop" className="button button-light button-small">Browse the collection <ArrowRight size={14} /></Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {shop}. Made with care, for every day.</span><span>Website developed by {settings?.websiteCredit ?? "Mr. Amber Rehan"}</span></div>
  </footer>;
}
