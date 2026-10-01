import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const categories = [
  "Men's Wear", "Women's Wear", "Kids Wear", "T-Shirts", "Shirts", "Jeans",
  "Trousers", "Kurtis", "Sarees", "Dresses", "Jackets", "Sweaters", "Nightwear",
  "Traditional Wear", "Accessories", "Boys Wear", "Girls Wear"
];

type ExpandedProduct = {
  name: string;
  gender: "Men" | "Boys" | "Girls";
  subcategory: string;
  originalPrice: number;
  sellingPrice: number;
  colors: string[];
  sizes: string[];
  fabric: string;
  fit: string;
  pattern: string;
  tags: string[];
  imageId: string;
};

const adultSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const youthSizes = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y", "14-15Y"];
const womenSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const expandedCatalog: ExpandedProduct[] = [
  { name: "Premium Black Oversized Cotton T-Shirt", gender: "Men", subcategory: "Oversized T-Shirts", originalPrice: 1299, sellingPrice: 899, colors: ["Black", "Charcoal"], sizes: adultSizes, fabric: "heavyweight cotton", fit: "relaxed oversized", pattern: "solid crew neck, dropped shoulders", tags: ["New Arrival", "Trending", "Premium", "Oversized", "Cotton"], imageId: "1521572163474-6864f9cf17ab" },
  { name: "Men's Navy Blue Slim Fit Shirt", gender: "Men", subcategory: "Formal Shirts", originalPrice: 1899, sellingPrice: 1299, colors: ["Navy Blue", "White"], sizes: adultSizes, fabric: "cotton poplin", fit: "slim fit", pattern: "micro-grid, spread collar, full sleeves", tags: ["Formal", "Slim Fit", "Office", "New Arrival"], imageId: "1596755094514-f87e34085b2c" },
  { name: "Men's Olive Utility Cargo Pants", gender: "Men", subcategory: "Cargo Pants", originalPrice: 2199, sellingPrice: 1599, colors: ["Olive Green", "Black"], sizes: ["30", "32", "34", "36", "38"], fabric: "cotton twill", fit: "regular tapered", pattern: "six-pocket utility", tags: ["Trending", "Casual", "Regular Fit"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Men's Royal Blue Contrast Polo T-Shirt", gender: "Men", subcategory: "Polo T-Shirts", originalPrice: 1199, sellingPrice: 799, colors: ["Royal Blue", "White"], sizes: adultSizes, fabric: "piqué cotton", fit: "regular fit", pattern: "contrast collar, two-button placket", tags: ["Best Seller", "Casual", "Cotton"], imageId: "1625910513413-5fc4f2fb8f37" },
  { name: "Men's Rust Geometric Printed T-Shirt", gender: "Men", subcategory: "Printed T-Shirts", originalPrice: 999, sellingPrice: 649, colors: ["Orange", "Cream"], sizes: adultSizes, fabric: "soft cotton jersey", fit: "regular fit", pattern: "all-over geometric print, crew neck", tags: ["Printed", "Summer", "Casual", "Sale"], imageId: "1603252109303-2751441dd157" },
  { name: "Men's Classic White Plain T-Shirt", gender: "Men", subcategory: "Plain T-Shirts", originalPrice: 799, sellingPrice: 499, colors: ["White", "Black", "Sky Blue"], sizes: adultSizes, fabric: "combed cotton", fit: "regular fit", pattern: "solid, ribbed crew neck", tags: ["Best Seller", "Plain", "Cotton", "Casual"], imageId: "1521572163474-6864f9cf17ab" },
  { name: "Men's Indigo Denim Casual Shirt", gender: "Men", subcategory: "Denim Shirts", originalPrice: 1999, sellingPrice: 1399, colors: ["Blue", "Sky Blue"], sizes: adultSizes, fabric: "washed cotton denim", fit: "regular fit", pattern: "western yoke, snap buttons", tags: ["Denim", "Casual", "Trending"], imageId: "1603252109303-2751441dd157" },
  { name: "Men's Mid-Rise Slim Fit Blue Jeans", gender: "Men", subcategory: "Slim Fit Jeans", originalPrice: 2499, sellingPrice: 1799, colors: ["Blue", "Navy Blue"], sizes: ["30", "32", "34", "36", "38"], fabric: "stretch denim", fit: "slim fit", pattern: "faded mid-wash, five pocket", tags: ["Denim", "Slim Fit", "Best Seller"], imageId: "1542272604-787c3835535d" },
  { name: "Men's Indigo Regular Fit Everyday Jeans", gender: "Men", subcategory: "Regular Fit Jeans", originalPrice: 2399, sellingPrice: 1699, colors: ["Blue", "Black"], sizes: ["30", "32", "34", "36", "38"], fabric: "cotton denim", fit: "regular fit", pattern: "clean dark wash, straight leg", tags: ["Denim", "Regular Fit", "Casual"], imageId: "1541099649105-f69ad21f3246" },
  { name: "Men's Sandstone Pleated Formal Trousers", gender: "Men", subcategory: "Trousers", originalPrice: 1799, sellingPrice: 1199, colors: ["Beige", "Charcoal"], sizes: ["30", "32", "34", "36", "38"], fabric: "poly-viscose blend", fit: "straight fit", pattern: "single pleat, pressed crease", tags: ["Formal", "Office", "Premium"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Men's Olive Stretch Cotton Chinos", gender: "Men", subcategory: "Chinos", originalPrice: 1899, sellingPrice: 1299, colors: ["Olive Green", "Navy Blue"], sizes: ["30", "32", "34", "36", "38"], fabric: "stretch cotton twill", fit: "tapered fit", pattern: "solid, chino pockets", tags: ["Casual", "Cotton", "Trending"], imageId: "1542272604-787c3835535d" },
  { name: "Men's Navy Weekend Drawstring Shorts", gender: "Men", subcategory: "Shorts", originalPrice: 999, sellingPrice: 649, colors: ["Navy Blue", "Grey"], sizes: adultSizes, fabric: "cotton knit", fit: "relaxed fit", pattern: "solid with adjustable drawcord", tags: ["Summer", "Casual", "Cotton"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Men's Burgundy Fleece-Lined Hoodie", gender: "Men", subcategory: "Hoodies", originalPrice: 2299, sellingPrice: 1699, colors: ["Burgundy", "Charcoal"], sizes: adultSizes, fabric: "cotton-poly fleece", fit: "relaxed fit", pattern: "kangaroo pocket, adjustable hood", tags: ["Winter", "Trending", "Premium"], imageId: "1576566588028-4147f3842f27" },
  { name: "Men's Heather Grey Raglan Sweatshirt", gender: "Men", subcategory: "Sweatshirts", originalPrice: 1799, sellingPrice: 1199, colors: ["Grey", "Navy Blue"], sizes: adultSizes, fabric: "brushed cotton fleece", fit: "regular fit", pattern: "raglan sleeves, crew neck", tags: ["Winter", "Casual", "Cotton"], imageId: "1618354691373-d851c5c3a990" },
  { name: "Men's Charcoal Quilted Bomber Jacket", gender: "Men", subcategory: "Jackets", originalPrice: 3299, sellingPrice: 2499, colors: ["Charcoal", "Olive Green"], sizes: adultSizes, fabric: "quilted poly-cotton", fit: "regular fit", pattern: "ribbed cuffs, zip front", tags: ["Winter", "Premium", "Trending"], imageId: "1551028719-00167b16eac5" },
  { name: "Men's Washed Blue Trucker Denim Jacket", gender: "Men", subcategory: "Denim Jackets", originalPrice: 3499, sellingPrice: 2599, colors: ["Blue", "Black"], sizes: adultSizes, fabric: "cotton denim", fit: "classic fit", pattern: "contrast topstitch, chest pockets", tags: ["Denim", "Winter", "Trending"], imageId: "1551028719-00167b16eac5" },
  { name: "Men's Midnight Textured Festive Blazer", gender: "Men", subcategory: "Blazers", originalPrice: 4999, sellingPrice: 3799, colors: ["Navy Blue", "Charcoal"], sizes: adultSizes, fabric: "textured suiting blend", fit: "tailored fit", pattern: "single-breasted, notch lapel", tags: ["Party Wear", "Formal", "Premium"], imageId: "1617127365659-c47fa864d8bc" },
  { name: "Men's Cream Cotton Straight Kurta", gender: "Men", subcategory: "Kurta", originalPrice: 2199, sellingPrice: 1599, colors: ["Cream", "White"], sizes: adultSizes, fabric: "breathable cotton", fit: "straight fit", pattern: "woven placket, band collar", tags: ["Ethnic", "Cotton", "Festive"], imageId: "1617127365659-c47fa864d8bc" },
  { name: "Men's Maroon Jacquard Nehru Set", gender: "Men", subcategory: "Ethnic Wear", originalPrice: 4299, sellingPrice: 3299, colors: ["Maroon", "Brown"], sizes: adultSizes, fabric: "jacquard cotton blend", fit: "classic fit", pattern: "woven Nehru jacket with kurta", tags: ["Ethnic", "Party Wear", "Premium"], imageId: "1617127365659-c47fa864d8bc" },
  { name: "Men's Teal Quick-Dry Training T-Shirt", gender: "Men", subcategory: "Sports Wear", originalPrice: 1099, sellingPrice: 749, colors: ["Teal", "Black"], sizes: adultSizes, fabric: "moisture-wicking performance knit", fit: "athletic fit", pattern: "mesh side panels, crew neck", tags: ["Sports", "Summer", "Trending"], imageId: "1521572163474-6864f9cf17ab" },
  { name: "Men's Black Sequin-Collar Party Shirt", gender: "Men", subcategory: "Party Wear", originalPrice: 2299, sellingPrice: 1699, colors: ["Black", "Burgundy"], sizes: adultSizes, fabric: "soft satin-finish cotton blend", fit: "tailored fit", pattern: "subtle shimmer collar, full sleeves", tags: ["Party Wear", "Premium", "Trending"], imageId: "1596755094514-f87e34085b2c" },
  { name: "Men's Light Blue Easy-Iron Office Shirt", gender: "Men", subcategory: "Formal Wear", originalPrice: 1799, sellingPrice: 1249, colors: ["Sky Blue", "White"], sizes: adultSizes, fabric: "easy-iron cotton blend", fit: "regular fit", pattern: "fine stripe, button-down collar", tags: ["Formal", "Office", "Best Seller"], imageId: "1603252109303-2751441dd157" },
  { name: "Men's Rust Linen-Blend Camp Collar Shirt", gender: "Men", subcategory: "Casual Shirts", originalPrice: 1599, sellingPrice: 1099, colors: ["Orange", "Beige"], sizes: adultSizes, fabric: "linen-cotton blend", fit: "relaxed fit", pattern: "solid resort collar, short sleeves", tags: ["Casual", "Summer", "Premium"], imageId: "1596755094514-f87e34085b2c" },
  { name: "Men's Multicolour Panelled Track Jacket", gender: "Men", subcategory: "Sports Wear", originalPrice: 2499, sellingPrice: 1799, colors: ["Multicolour", "Navy Blue"], sizes: adultSizes, fabric: "lightweight performance polyester", fit: "athletic fit", pattern: "colour-block panels, stand collar", tags: ["Sports", "Trending", "New Arrival"], imageId: "1551028719-00167b16eac5" },
  { name: "Boys Blue Space-Print Cotton T-Shirt", gender: "Boys", subcategory: "Printed T-Shirts", originalPrice: 799, sellingPrice: 499, colors: ["Blue", "Navy Blue"], sizes: youthSizes, fabric: "soft cotton jersey", fit: "easy regular fit", pattern: "space graphic, crew neck", tags: ["New Arrival", "Printed", "Cotton", "Summer"], imageId: "1503919005314-30d93d07d823" },
  { name: "Boys Red Colour-Pop Polo T-Shirt", gender: "Boys", subcategory: "Polo T-Shirts", originalPrice: 899, sellingPrice: 599, colors: ["Red", "White"], sizes: youthSizes, fabric: "breathable piqué cotton", fit: "regular fit", pattern: "contrast tipped collar, button placket", tags: ["Best Seller", "Casual", "Cotton"], imageId: "1519238263530-99bdd11df2ea" },
  { name: "Boys Green Dino Graphic T-Shirt", gender: "Boys", subcategory: "Cartoon/Graphic T-Shirts", originalPrice: 749, sellingPrice: 449, colors: ["Green", "Yellow"], sizes: youthSizes, fabric: "cotton jersey", fit: "easy fit", pattern: "playful dinosaur graphic, crew neck", tags: ["Printed", "Trending", "Summer"], imageId: "1503919005314-30d93d07d823" },
  { name: "Boys Mustard Everyday Plain T-Shirt", gender: "Boys", subcategory: "Plain T-Shirts", originalPrice: 649, sellingPrice: 399, colors: ["Mustard", "Black", "White"], sizes: youthSizes, fabric: "combed cotton", fit: "regular fit", pattern: "solid, rib-knit neck", tags: ["Plain", "Cotton", "Casual"], imageId: "1519238263530-99bdd11df2ea" },
  { name: "Boys Sky Blue Contrast-Sleeve T-Shirt", gender: "Boys", subcategory: "T-Shirts", originalPrice: 749, sellingPrice: 479, colors: ["Sky Blue", "Grey"], sizes: youthSizes, fabric: "cotton slub jersey", fit: "regular fit", pattern: "contrast raglan sleeves", tags: ["New Arrival", "Casual", "Summer"], imageId: "1503919005314-30d93d07d823" },
  { name: "Boys Teal Mini-Check Casual Shirt", gender: "Boys", subcategory: "Casual Shirts", originalPrice: 1199, sellingPrice: 799, colors: ["Teal", "White"], sizes: youthSizes, fabric: "cotton poplin", fit: "classic fit", pattern: "mini-check, button front", tags: ["Casual", "Cotton", "Trending"], imageId: "1519238263530-99bdd11df2ea" },
  { name: "Boys White Oxford Long-Sleeve Shirt", gender: "Boys", subcategory: "Shirts", originalPrice: 1299, sellingPrice: 849, colors: ["White", "Sky Blue"], sizes: youthSizes, fabric: "textured cotton Oxford", fit: "regular fit", pattern: "clean button-down, chest pocket", tags: ["Casual", "Cotton", "Best Seller"], imageId: "1603252109303-2751441dd157" },
  { name: "Boys Indigo Straight-Leg Stretch Jeans", gender: "Boys", subcategory: "Jeans", originalPrice: 1499, sellingPrice: 999, colors: ["Blue", "Navy Blue"], sizes: youthSizes, fabric: "stretch cotton denim", fit: "straight fit", pattern: "classic five-pocket, mid wash", tags: ["Denim", "Regular Fit", "Casual"], imageId: "1542272604-787c3835535d" },
  { name: "Boys Olive Adventure Cargo Pants", gender: "Boys", subcategory: "Cargo Pants", originalPrice: 1599, sellingPrice: 1099, colors: ["Olive Green", "Khaki"], sizes: youthSizes, fabric: "cotton twill", fit: "relaxed fit", pattern: "utility flap pockets, adjustable waist", tags: ["Trending", "Casual", "Regular Fit"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Boys Charcoal Pull-On School Trousers", gender: "Boys", subcategory: "Trousers", originalPrice: 1199, sellingPrice: 799, colors: ["Charcoal", "Navy Blue"], sizes: youthSizes, fabric: "durable poly-cotton", fit: "straight fit", pattern: "flat front, elastic-adjustable waist", tags: ["Casual", "Regular Fit", "School/College Casual Wear"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Boys Orange Sporty Mesh Shorts", gender: "Boys", subcategory: "Shorts", originalPrice: 799, sellingPrice: 499, colors: ["Orange", "Navy Blue"], sizes: youthSizes, fabric: "quick-dry mesh", fit: "athletic fit", pattern: "contrast side stripe, drawcord waist", tags: ["Sports", "Summer", "Trending"], imageId: "1503919005314-30d93d07d823" },
  { name: "Boys Red Colourblock Hooded Sweatshirt", gender: "Boys", subcategory: "Hoodies", originalPrice: 1499, sellingPrice: 999, colors: ["Red", "Charcoal"], sizes: youthSizes, fabric: "brushed cotton-poly fleece", fit: "relaxed fit", pattern: "colourblock hood, kangaroo pocket", tags: ["Winter", "Trending", "New Arrival"], imageId: "1576566588028-4147f3842f27" },
  { name: "Boys Navy Varsity Crew Sweatshirt", gender: "Boys", subcategory: "Sweatshirts", originalPrice: 1399, sellingPrice: 899, colors: ["Navy Blue", "Cream"], sizes: youthSizes, fabric: "soft cotton fleece", fit: "regular fit", pattern: "varsity chest applique, ribbed cuffs", tags: ["Winter", "Casual", "Cotton"], imageId: "1618354691373-d851c5c3a990" },
  { name: "Boys Blue Lightweight Zip-Front Jacket", gender: "Boys", subcategory: "Jackets", originalPrice: 1899, sellingPrice: 1299, colors: ["Dark Green", "Black"], sizes: youthSizes, fabric: "lightweight water-resistant shell", fit: "regular fit", pattern: "colour piping, stand collar", tags: ["Winter", "Trending", "Sports"], imageId: "1551028719-00167b16eac5" },
  { name: "Boys Cream Festive Embroidered Kurta", gender: "Boys", subcategory: "Ethnic Wear", originalPrice: 1699, sellingPrice: 1199, colors: ["Cream", "Maroon"], sizes: youthSizes, fabric: "cotton-silk blend", fit: "straight fit", pattern: "tonal embroidery, band collar", tags: ["Ethnic", "Party Wear", "Premium"], imageId: "1617127365659-c47fa864d8bc" },
  { name: "Boys Burgundy Smart Party Waistcoat Set", gender: "Boys", subcategory: "Party Wear", originalPrice: 2499, sellingPrice: 1799, colors: ["Burgundy", "Beige"], sizes: youthSizes, fabric: "woven cotton blend", fit: "classic fit", pattern: "waistcoat, textured buttons, kurta set", tags: ["Party Wear", "Ethnic", "Premium"], imageId: "1617127365659-c47fa864d8bc" },
  { name: "Boys Green Quick-Dry Cricket Tee", gender: "Boys", subcategory: "Sports Wear", originalPrice: 999, sellingPrice: 649, colors: ["Green", "White"], sizes: youthSizes, fabric: "breathable quick-dry knit", fit: "athletic fit", pattern: "contrast shoulder panels, crew neck", tags: ["Sports", "Summer", "Trending"], imageId: "1521572163474-6864f9cf17ab" },
  { name: "Boys Grey Campus Stripe T-Shirt", gender: "Boys", subcategory: "School/College Casual Wear", originalPrice: 899, sellingPrice: 599, colors: ["Grey", "Navy Blue"], sizes: youthSizes, fabric: "cotton-poly jersey", fit: "regular fit", pattern: "college-inspired chest lettering, stripes", tags: ["Casual", "Trending", "Cotton"], imageId: "1519238263530-99bdd11df2ea" },
  { name: "Girls Pink Floral Summer Dress", gender: "Girls", subcategory: "Dresses", originalPrice: 1799, sellingPrice: 1199, colors: ["Pink", "Light Pink"], sizes: youthSizes, fabric: "breathable cotton voile", fit: "fit-and-flare", pattern: "tiny floral print, gathered waist", tags: ["New Arrival", "Summer", "Party Wear"], imageId: "1515372039744-b8f02a3ae446" },
  { name: "Girls Lavender Everyday Casual Top", gender: "Girls", subcategory: "Tops", originalPrice: 999, sellingPrice: 649, colors: ["Lavender", "White"], sizes: youthSizes, fabric: "soft cotton jersey", fit: "relaxed fit", pattern: "scalloped sleeve, rounded neckline", tags: ["Casual", "Cotton", "New Arrival"], imageId: "1551163943-3f6a855d1153" },
  { name: "Girls Sunshine Yellow Printed Cotton T-Shirt", gender: "Girls", subcategory: "T-Shirts", originalPrice: 749, sellingPrice: 479, colors: ["Yellow", "Pink"], sizes: youthSizes, fabric: "combed cotton jersey", fit: "regular fit", pattern: "small floral chest print, crew neck", tags: ["Printed", "Summer", "Cotton"], imageId: "1503919005314-30d93d07d823" },
  { name: "Girls Red Rose Garden Printed Top", gender: "Girls", subcategory: "Printed Tops", originalPrice: 1099, sellingPrice: 699, colors: ["Red", "Cream"], sizes: youthSizes, fabric: "cotton lawn", fit: "easy fit", pattern: "rose-vine print, flutter sleeves", tags: ["Printed", "Summer", "Trending"], imageId: "1551163943-3f6a855d1153" },
  { name: "Girls Teal Everyday Ribbed Crop Top", gender: "Girls", subcategory: "Crop Tops", originalPrice: 899, sellingPrice: 599, colors: ["Teal", "Black"], sizes: womenSizes, fabric: "cotton-spandex rib knit", fit: "fitted", pattern: "ribbed texture, square neckline", tags: ["Trending", "Casual", "Summer"], imageId: "1503341455253-b2e723bb3dbb" },
  { name: "Girls Lilac Chambray Button-Front Shirt", gender: "Girls", subcategory: "Shirts", originalPrice: 1299, sellingPrice: 849, colors: ["Lavender", "Sky Blue"], sizes: youthSizes, fabric: "soft chambray cotton", fit: "relaxed fit", pattern: "rounded collar, cuffed sleeves", tags: ["Casual", "Cotton", "Trending"], imageId: "1551163943-3f6a855d1153" },
  { name: "Girls Wide-Leg Blue Denim Jeans", gender: "Girls", subcategory: "Wide Leg Jeans", originalPrice: 1899, sellingPrice: 1299, colors: ["Blue", "Sky Blue"], sizes: youthSizes, fabric: "soft cotton denim", fit: "wide leg", pattern: "light wash, adjustable waist", tags: ["Denim", "Trending", "Regular Fit"], imageId: "1542272604-787c3835535d" },
  { name: "Girls Olive Drawstring Utility Cargo Pants", gender: "Girls", subcategory: "Cargo Pants", originalPrice: 1699, sellingPrice: 1149, colors: ["Olive Green", "Beige"], sizes: youthSizes, fabric: "cotton twill", fit: "relaxed tapered", pattern: "utility pockets, adjustable drawstring", tags: ["Trending", "Casual", "Regular Fit"], imageId: "1473966968600-fa801b869a1a" },
  { name: "Girls Mauve Pull-On Everyday Trousers", gender: "Girls", subcategory: "Trousers", originalPrice: 1299, sellingPrice: 849, colors: ["Pink", "Charcoal"], sizes: youthSizes, fabric: "cotton-rayon blend", fit: "straight fit", pattern: "soft pleats, elasticated back waist", tags: ["Casual", "Summer", "Cotton"], imageId: "1541099649105-f69ad21f3246" },
  { name: "Girls Sky Blue Daisy Summer Shorts", gender: "Girls", subcategory: "Shorts", originalPrice: 799, sellingPrice: 499, colors: ["Sky Blue", "Yellow"], sizes: youthSizes, fabric: "lightweight cotton poplin", fit: "relaxed fit", pattern: "ditsy floral, scalloped hem", tags: ["Summer", "Printed", "Casual"], imageId: "1503919005314-30d93d07d823" },
  { name: "Girls Maroon Tiered Cotton Midi Skirt", gender: "Girls", subcategory: "Skirts", originalPrice: 1199, sellingPrice: 799, colors: ["Maroon", "Cream"], sizes: youthSizes, fabric: "soft cotton voile", fit: "flared", pattern: "three gathered tiers, elastic waist", tags: ["Casual", "Summer", "Trending"], imageId: "1515372039744-b8f02a3ae446" },
  { name: "Girls Peach Party Frock with Bow", gender: "Girls", subcategory: "Frocks", originalPrice: 1999, sellingPrice: 1399, colors: ["Orange", "Light Pink"], sizes: youthSizes, fabric: "cotton-satin blend", fit: "fit-and-flare", pattern: "pleated skirt, detachable bow", tags: ["Party Wear", "Premium", "New Arrival"], imageId: "1515372039744-b8f02a3ae446" },
  { name: "Girls Teal Play-All-Day Cotton Jumpsuit", gender: "Girls", subcategory: "Jumpsuits", originalPrice: 1699, sellingPrice: 1149, colors: ["Teal", "Mustard"], sizes: youthSizes, fabric: "breathable cotton", fit: "relaxed fit", pattern: "wide leg, adjustable shoulder straps", tags: ["Casual", "Summer", "Trending"], imageId: "1529139574466-a303027c1d8b" },
  { name: "Girls Plum Soft-Fleece Zip Hoodie", gender: "Girls", subcategory: "Hoodies", originalPrice: 1499, sellingPrice: 999, colors: ["Purple", "Lavender"], sizes: youthSizes, fabric: "brushed cotton-poly fleece", fit: "relaxed fit", pattern: "zip front, jersey-lined hood", tags: ["Winter", "Trending", "Casual"], imageId: "1576566588028-4147f3842f27" },
  { name: "Girls Pink Heart-Patch Crew Sweatshirt", gender: "Girls", subcategory: "Sweatshirts", originalPrice: 1299, sellingPrice: 849, colors: ["Pink", "Grey"], sizes: youthSizes, fabric: "soft cotton fleece", fit: "regular fit", pattern: "embroidered heart patch, ribbed cuffs", tags: ["Winter", "Cotton", "New Arrival"], imageId: "1618354691373-d851c5c3a990" },
  { name: "Girls Lavender Quilted Winter Jacket", gender: "Girls", subcategory: "Jackets", originalPrice: 2299, sellingPrice: 1599, colors: ["Lavender", "Navy Blue"], sizes: youthSizes, fabric: "lightweight quilted polyester", fit: "regular fit", pattern: "diamond quilting, soft stand collar", tags: ["Winter", "Premium", "Trending"], imageId: "1551028719-00167b16eac5" },
  { name: "Girls Rose-Pink Printed Everyday Kurti", gender: "Girls", subcategory: "Kurtis", originalPrice: 1499, sellingPrice: 999, colors: ["Pink", "White"], sizes: youthSizes, fabric: "cotton cambric", fit: "A-line", pattern: "block-print florals, three-quarter sleeves", tags: ["Ethnic", "Printed", "Cotton"], imageId: "1583391733956-6c78276477e1" },
  { name: "Girls Cream Embroidered Festive Anarkali", gender: "Girls", subcategory: "Ethnic Wear", originalPrice: 2499, sellingPrice: 1799, colors: ["Cream", "Burgundy"], sizes: youthSizes, fabric: "soft cotton-silk blend", fit: "flared Anarkali", pattern: "yoke embroidery, gathered skirt", tags: ["Ethnic", "Party Wear", "Premium"], imageId: "1610030469983-98e550d6193c" },
  { name: "Girls Burgundy Sequin Celebration Dress", gender: "Girls", subcategory: "Party Wear", originalPrice: 2299, sellingPrice: 1599, colors: ["Burgundy", "Gold"], sizes: youthSizes, fabric: "cotton satin with soft lining", fit: "fit-and-flare", pattern: "sequin bodice, layered skirt", tags: ["Party Wear", "Premium", "Trending"], imageId: "1515372039744-b8f02a3ae446" },
  { name: "Girls Multicolour Activewear Legging Set", gender: "Girls", subcategory: "Sports Wear", originalPrice: 1399, sellingPrice: 949, colors: ["Multicolour", "Navy Blue"], sizes: youthSizes, fabric: "stretch quick-dry jersey", fit: "athletic fit", pattern: "colour-block tee with flexible leggings", tags: ["Sports", "Summer", "Trending"], imageId: "1529390079861-591de354faf5" },
  { name: "Girls Navy Campus Stripe Casual Shirt", gender: "Girls", subcategory: "Casual Wear", originalPrice: 1399, sellingPrice: 949, colors: ["Navy Blue", "White"], sizes: youthSizes, fabric: "cotton poplin", fit: "relaxed fit", pattern: "vertical pinstripe, chest pocket", tags: ["Casual", "Cotton", "School/College Casual Wear"], imageId: "1551163943-3f6a855d1153" }
];

const imageAlternatives: Record<ExpandedProduct["gender"], string[]> = {
  Men: [
    "1523381210434-271e8be1f52b", "1539109136881-3be0616acf4b", "1534528741775-53994a69daeb",
    "1551488831-00ddcb6c6bd3", "1544441893-675973e31985", "1515886657613-9f3515b0c78f",
    "1539533018447-63fcce2678e3", "1485968579580-b6d095142e6e", "1485230895905-ec40ba36b9bc",
    "1509631179647-0177331693ae", "1490481651871-ab68de25d43d", "1525507119028-ed4c629a60a3",
    "1551232864-3f0890e580d9", "1591047139829-d91aecb6caea", "1523398002811-999ca8dec234",
    "1516826957135-700dedea698c", "1598033129183-c4f50c736f10", "1620799140408-edc6dcb6d633",
    "1627225924765-552d49cf47ad", "1564859228273-274232fdb516", "1556905055-8f358a7a47b2"
  ],
  Boys: [
    "1566206091558-7f218b696731", "1516627145497-ae6968895b74", "1622290291468-a28f7a7dc6a8",
    "1519689680058-324335c77eba", "1621184455862-c163dfb30e0f", "1471286174890-9c112ffca5b4",
    "1509062522246-3755977927d7", "1503454537195-1dcabb73ffb9", "1484820540004-14229fe36ca4",
    "1519457431-44ccd64a579b", "1596461404969-9ae70f2830c1", "1596870230751-ebdfce98ec42",
    "1620331311520-246422fd82f9"
  ],
  Girls: [
    "1483985988355-763728e1935b", "1503342217505-b0a15ec3261c", "1539109136881-3be0616acf4b",
    "1534528741775-53994a69daeb", "1551488831-00ddcb6c6bd3", "1544441893-675973e31985",
    "1515886657613-9f3515b0c78f", "1539533018447-63fcce2678e3", "1485968579580-b6d095142e6e",
    "1485230895905-ec40ba36b9bc", "1509631179647-0177331693ae", "1496747611176-843222e1e57c",
    "1495385794356-15371f348c31", "1490481651871-ab68de25d43d", "1525507119028-ed4c629a60a3",
    "1551232864-3f0890e580d9", "1517841905240-472988babdf9", "1512436991641-6745cdb1723f",
    "1523381210434-271e8be1f52b", "1503341455253-b2e723bb3dbb", "1543076447-215ad9ba6923",
    "1490114538077-0a7f8cb49891", "1529374255404-311a2a4f1fd9", "1583743814966-8936f5b7be1a",
    "1517466787929-bc90951d0974", "1530268729831-4b0b9e170218",
    "1556821840-3a63f95609a7", "1539185441755-769473a23570"
  ]
};

const catalog = [
  ["Everyday Cotton Tee", "T-Shirts", 699, 449, 28, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", true, true],
  ["Classic Oxford Shirt", "Shirts", 1499, 999, 16, ["M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85", true, false],
  ["Indigo Straight Jeans", "Jeans", 1899, 1299, 12, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85", true, true],
  ["Soft Linen Blend Kurti", "Kurtis", 1299, 849, 20, ["S", "M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1583391733956-6c78276477e1?auto=format&fit=crop&w=900&q=85", true, false],
  ["Sunset Floral Dress", "Dresses", 1799, 1199, 22, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85", true, true],
  ["Weekend Relaxed Trousers", "Trousers", 1399, 949, 14, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85", false, false],
  ["Little Explorer Hoodie", "Kids Wear", 999, 699, 24, ["2-4Y", "4-6Y", "6-8Y"], "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85", true, true],
  ["Rose Garden Saree", "Sarees", 2499, 1899, 9, ["Free Size"], "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85", true, false],
  ["Lightweight Denim Jacket", "Jackets", 2299, 1699, 10, ["M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", false, true],
  ["Cozy Knit Sweater", "Sweaters", 1799, 1299, 13, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85", true, false],
  ["Cloud Soft Sleep Set", "Nightwear", 1199, 799, 18, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85", false, true],
  ["Modern Nehru Jacket", "Traditional Wear", 2699, 1999, 11, ["M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=85", true, false],
  ["Easy Day Polo Shirt", "Men's Wear", 1099, 749, 17, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1625910513413-5fc4f2fb8f37?auto=format&fit=crop&w=900&q=85", false, true],
  ["Printed Everyday Top", "Women's Wear", 999, 699, 19, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=85", true, false],
  ["Playful Kids Tee", "Kids Wear", 599, 399, 16, ["2-4Y", "4-6Y", "6-8Y"], "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=85", false, true],
  ["Classic Button-Down Shirt", "Shirts", 1599, 1099, 15, ["M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85", false, false],
  ["A-Line Festive Kurti", "Kurtis", 1599, 1199, 14, ["S", "M", "L", "XL", "XXL"], "https://images.unsplash.com/photo-1610030469668-8e9f641a9d72?auto=format&fit=crop&w=900&q=85", false, true],
] as const;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const categoryIds = new Map<string, string>();
  for (const name of categories) {
    const category = await db.category.upsert({
      where: { slug: slugify(name) },
      update: { name, enabled: true },
      create: { name, slug: slugify(name) }
    });
    categoryIds.set(name, category.id);
  }

  for (const [index, [name, categoryName, originalPrice, sellingPrice, stock, sizes, imageUrl, featured, newArrival]] of catalog.entries()) {
    const slug = slugify(name);
    await db.product.upsert({
      where: { slug },
      update: {},
      create: {
        name, slug, categoryId: categoryIds.get(categoryName)!,
        brand: "SABA READYMADE",
        description: `Meet the ${name.toLowerCase()} — thoughtfully selected for everyday comfort, easy styling and great value. A versatile addition to your ${categoryName.toLowerCase()} collection.`,
        imageUrl, images: JSON.stringify([imageUrl]),
        originalPrice, sellingPrice,
        discountPercent: Math.round((1 - sellingPrice / originalPrice) * 100),
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(["Midnight", "Sand"]),
        keywords: JSON.stringify([categoryName, name.split(" ")[0], "fashion", "clothing"]),
        stock, rating: 4.2 + (index % 8) / 10, reviewCount: 14 + index * 7,
        featured, newArrival, offer: sellingPrice < originalPrice
      }
    });
  }

  const genderCategoryIds = new Map<string, string>([
    ["Men", categoryIds.get("Men's Wear")!],
    ["Boys", categoryIds.get("Boys Wear")!],
    ["Girls", categoryIds.get("Girls Wear")!]
  ]);
  const usedImageIds = new Set<string>();
  for (const [index, product] of expandedCatalog.entries()) {
    const imageId = usedImageIds.has(product.imageId)
      ? imageAlternatives[product.gender].find((candidate) => !usedImageIds.has(candidate)) ?? product.imageId
      : product.imageId;
    usedImageIds.add(imageId);
    const imageUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=900&q=85`;
    const categoryId = genderCategoryIds.get(product.gender)!;
    const tags = [...new Set([
      product.gender === "Men" ? "Men's Wear" : `${product.gender} Wear`,
      product.gender, product.subcategory, product.fabric,
      product.fit, product.pattern, ...product.tags, ...product.colors
    ])];
    const productData = {
      categoryId,
      brand: product.gender === "Boys" || product.gender === "Girls" ? "SABA Kids" : index % 3 === 0 ? "SABA Studio" : "SABA READYMADE",
      description: `${product.name} in ${product.fabric}, designed in a ${product.fit} silhouette. ${product.pattern}. Subcategory: ${product.subcategory}. Available colours: ${product.colors.join(", ")}. Sizes: ${product.sizes.join(", ")}.`,
      imageUrl,
      images: JSON.stringify([imageUrl]),
      originalPrice: product.originalPrice,
      sellingPrice: product.sellingPrice,
      discountPercent: Math.round((1 - product.sellingPrice / product.originalPrice) * 100),
      sizes: JSON.stringify(product.sizes),
      colors: JSON.stringify(product.colors),
      keywords: JSON.stringify(tags),
      stock: 12 + (index * 7) % 31,
      rating: 4 + (index % 10) / 10,
      reviewCount: 18 + index * 9,
      featured: index % 5 === 0,
      newArrival: index % 3 === 0,
      offer: product.sellingPrice < product.originalPrice
    };
    const slug = slugify(product.name);
    const existing = await db.product.findUnique({ where: { slug }, select: { imageUrl: true, colors: true } });
    const sourceImages = [product.imageId, ...imageAlternatives[product.gender]];
    const isSeedImage = existing !== null && sourceImages.some((source) => existing.imageUrl.includes(`photo-${source}?`));
    const oldColorVariants: Record<string, string> = {
      "men-s-maroon-jacquard-nehru-set": JSON.stringify(["Maroon", "Beige"]),
      "boys-blue-lightweight-zip-front-jacket": JSON.stringify(["Royal Blue", "Black"])
    };
    const isSeedColorSet = existing !== null && (
      existing.colors === productData.colors || existing.colors === oldColorVariants[slug]
    );
    const updateData = {
      ...(isSeedImage ? { imageUrl, images: productData.images } : {}),
      ...(isSeedColorSet ? { colors: productData.colors, keywords: productData.keywords } : {})
    };
    await db.product.upsert({
      where: { slug },
      update: updateData,
      create: {
        name: product.name,
        slug,
        ...productData
      }
    });
  }

  await db.storeSettings.upsert({
    where: { id: "store" },
    update: {},
    create: { id: "store", heroTitle: "Find your everyday\nfavorite." }
  });
  const settings = await db.storeSettings.findUnique({ where: { id: "store" } });
  if (settings?.heroTitle === "Find your everyday\\nfavorite." || settings?.heroTitle === "Find your everyday favorite.") {
    await db.storeSettings.update({ where: { id: "store" }, data: { heroTitle: "Find your everyday\nfavorite." } });
  }
  console.log(`Seeded ${categories.length} categories, ${catalog.length + expandedCatalog.length} products, and store settings.`);
}

main().catch((error: unknown) => {
  console.error("Database seeding failed:", error);
  process.exitCode = 1;
}).finally(async () => {
  await db.$disconnect();
});
