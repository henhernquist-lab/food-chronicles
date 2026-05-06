import { Article } from "@/data/articles";

// ─────────────────────────────────────────────────────────────────────────────
// Affiliate product data per article food
// Sign up at affiliate-program.amazon.com and replace 'foodchronicle-20'
// with your actual Associate ID.
// ─────────────────────────────────────────────────────────────────────────────
interface AffiliateProduct {
  name: string;
  reason: string;
  price_range: string;
  amazon_search_url?: string;
  retailer?: string;
  retailer_url?: string;
  retailer_note?: string;
}

const PRODUCTS: Record<string, AffiliateProduct[]> = {
  Chocolate: [
    {
      name: "Single-Origin Madagascar Cacao Nibs",
      reason: "Experience the same cacao that sparked the Aztec obsession — raw, unprocessed, and intensely flavored",
      price_range: "$12–20",
      amazon_search_url: "https://amazon.com/s?k=single+origin+madagascar+cacao+nibs&tag=foodchronicle-20",
    },
    {
      name: "Valrhona 85% Dark Chocolate",
      reason: "The gold standard of modern chocolate — as close to Aztec bitterness as you can get in a luxury bar",
      price_range: "$8–15",
      amazon_search_url: "https://amazon.com/s?k=valrhona+85+dark+chocolate&tag=foodchronicle-20",
    },
    {
      name: "Vintage Cocoa Press Replica",
      reason: "A nod to Van Houten's 1828 invention that made modern chocolate possible",
      price_range: "$25–45",
      amazon_search_url: "https://amazon.com/s?k=chocolate+making+kit+cocoa+press&tag=foodchronicle-20",
    },
  ],
  Peppers: [
    {
      name: "Carolina Reaper Pepper Seeds",
      reason: "Grow the world's hottest pepper — 2.2 million SHU — the apex of the Scoville arms race",
      price_range: "$6–12",
      amazon_search_url: "https://amazon.com/s?k=carolina+reaper+pepper+seeds&tag=foodchronicle-20",
    },
    {
      name: "Ancho Chile Powder (Mexican)",
      reason: "The same dried pepper variety the Aztecs classified and used for centuries",
      price_range: "$8–16",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
    {
      name: "Scoville Scale Hot Sauce Collection",
      reason: "Taste the full spectrum from mild to extreme — a journey through capsaicin history",
      price_range: "$25–50",
      amazon_search_url: "https://amazon.com/s?k=scoville+scale+hot+sauce+variety+pack&tag=foodchronicle-20",
    },
  ],
  Vanilla: [
    {
      name: "Single Origin Madagascar Vanilla Beans",
      reason: "Experience the same vanilla that started the global obsession — the original Bourbon vanilla",
      price_range: "$15–30",
      amazon_search_url: "https://amazon.com/s?k=madagascar+vanilla+beans+premium&tag=foodchronicle-20",
    },
    {
      name: "Tahitian Vanilla Extract",
      reason: "The rarer, floral variety — prized by top pastry chefs worldwide",
      price_range: "$18–35",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
    {
      name: "Vanilla Bean Paste (Nielsen-Massey)",
      reason: "The professional baker's secret — whole bean specks in every spoonful",
      price_range: "$20–35",
      amazon_search_url: "https://amazon.com/s?k=nielsen+massey+vanilla+bean+paste&tag=foodchronicle-20",
    },
  ],
  Salt: [
    {
      name: "Himalayan Pink Salt Block",
      reason: "Cook and serve on ancient sea-bed salt — the same mineral that built empires",
      price_range: "$25–45",
      amazon_search_url: "https://amazon.com/s?k=himalayan+pink+salt+block+cooking&tag=foodchronicle-20",
    },
    {
      name: "Fleur de Sel de Guérande",
      reason: "The French salt that inspired the infamous gabelle tax — hand-harvested since medieval times",
      price_range: "$12–22",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
    {
      name: "Maldon Sea Salt Flakes",
      reason: "The finishing salt used by professional chefs — pure, pyramid-shaped crystals",
      price_range: "$8–15",
      amazon_search_url: "https://amazon.com/s?k=maldon+sea+salt+flakes&tag=foodchronicle-20",
    },
  ],
  Avocado: [
    {
      name: "Hass Avocado Tree (Live Plant)",
      reason: "Grow your own — every Hass avocado in the world descends from one mail carrier's tree",
      price_range: "$30–60",
      amazon_search_url: "https://amazon.com/s?k=hass+avocado+tree+live+plant&tag=foodchronicle-20",
    },
    {
      name: "Mexican Molcajete (Volcanic Stone)",
      reason: "Make guacamole the Aztec way — in the same volcanic stone mortars used for 5,000 years",
      price_range: "$35–65",
      amazon_search_url: "https://amazon.com/s?k=mexican+molcajete+volcanic+stone&tag=foodchronicle-20",
    },
    {
      name: "Avocado Oil (Cold Pressed)",
      reason: "The highest smoke-point cooking oil — extracted from the same fatty fruit that rescued itself from extinction",
      price_range: "$12–22",
      amazon_search_url: "https://amazon.com/s?k=cold+pressed+avocado+oil+cooking&tag=foodchronicle-20",
    },
  ],
  Tea: [
    {
      name: "Darjeeling First Flush Tea",
      reason: "Grown on the very plantations established from tea stolen from China by Robert Fortune in the 1840s",
      price_range: "$18–40",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
    {
      name: "Yixing Zisha Clay Teapot",
      reason: "The same unglazed clay teapots used in Chinese tea ceremonies for over 500 years",
      price_range: "$40–120",
      amazon_search_url: "https://amazon.com/s?k=yixing+zisha+clay+teapot+authentic&tag=foodchronicle-20",
    },
    {
      name: "Pu-erh Aged Tea Cake",
      reason: "Tea that ages like wine — some cakes are over 20 years old and worth hundreds of dollars",
      price_range: "$25–80",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
  ],
  Pizza: [
    {
      name: "Caputo '00' Flour (Neapolitan)",
      reason: "The flour used by every authentic Neapolitan pizzeria — finely milled for the perfect crust",
      price_range: "$12–20",
      amazon_search_url: "https://amazon.com/s?k=caputo+00+flour+neapolitan+pizza&tag=foodchronicle-20",
    },
    {
      name: "Baking Steel (Pizza Stone Alternative)",
      reason: "Replicates the 900°F wood-fired oven floor that makes Neapolitan pizza legendary",
      price_range: "$80–120",
      amazon_search_url: "https://amazon.com/s?k=baking+steel+pizza+stone&tag=foodchronicle-20",
    },
    {
      name: "San Marzano DOP Tomatoes",
      reason: "The only tomatoes used in authentic Neapolitan pizza — grown in volcanic soil near Vesuvius",
      price_range: "$5–10",
      amazon_search_url: "https://amazon.com/s?k=san+marzano+dop+tomatoes+certified&tag=foodchronicle-20",
    },
  ],
  Bread: [
    {
      name: "Sourdough Starter Culture",
      reason: "Some sourdough starters are over 100 years old — you're inheriting a living piece of bread history",
      price_range: "$10–25",
      amazon_search_url: "https://amazon.com/s?k=sourdough+starter+culture+artisan&tag=foodchronicle-20",
    },
    {
      name: "Banneton Proofing Basket Set",
      reason: "The traditional rattan baskets used by European bakers for centuries to shape artisan loaves",
      price_range: "$20–40",
      amazon_search_url: "https://amazon.com/s?k=banneton+proofing+basket+sourdough&tag=foodchronicle-20",
    },
    {
      name: "Emile Henry Bread Cloche",
      reason: "Traps steam like a professional deck oven — the secret to bakery-quality crust at home",
      price_range: "$60–100",
      amazon_search_url: "https://amazon.com/s?k=emile+henry+bread+cloche+baking&tag=foodchronicle-20",
    },
  ],
  Sushi: [
    {
      name: "Hinoki Cypress Cutting Board",
      reason: "The same aromatic wood used in traditional Japanese sushi preparation for centuries",
      price_range: "$40–90",
      amazon_search_url: "https://amazon.com/s?k=hinoki+cypress+cutting+board+japanese&tag=foodchronicle-20",
    },
    {
      name: "Nishiki Premium Sushi Rice",
      reason: "The short-grain rice that defines sushi — grown in California using Japanese cultivation methods",
      price_range: "$8–15",
      amazon_search_url: "https://amazon.com/s?k=nishiki+premium+sushi+rice&tag=foodchronicle-20",
    },
    {
      name: "Japanese Wasabi Grater (Sharkskin)",
      reason: "Real wasabi requires a sharkskin grater — the traditional tool that creates the paste's unique texture",
      price_range: "$30–70",
      retailer: "Marx Foods",
      retailer_url: "https://www.marxfoods.com",
      retailer_note: "Best source for exotic and specialty culinary ingredients",
    },
  ],
  Banana: [
    {
      name: "Gros Michel Banana Seeds",
      reason: "The original banana that went extinct in the 1950s — now available as a rare novelty plant",
      price_range: "$8–18",
      amazon_search_url: "https://amazon.com/s?k=gros+michel+banana+plant+seeds&tag=foodchronicle-20",
    },
    {
      name: "Banana Leaf Plates (Traditional)",
      reason: "The same banana leaves used as plates across Southeast Asia for thousands of years",
      price_range: "$12–20",
      amazon_search_url: "https://amazon.com/s?k=banana+leaf+plates+traditional&tag=foodchronicle-20",
    },
    {
      name: "Dried Plantain Chips (Artisan)",
      reason: "The cooking banana that predates the sweet dessert banana — still a staple across Africa and the Caribbean",
      price_range: "$6–12",
      retailer: "Kalustyan's",
      retailer_url: "https://foodsofnations.com",
      retailer_note: "Best specialty food retailer for hard-to-find ingredients",
    },
  ],
};

interface AffiliateProductsProps {
  article: Article;
}

export function AffiliateProducts({ article }: AffiliateProductsProps) {
  const products = PRODUCTS[article.food];
  if (!products?.length) return null;

  return (
    <section className="my-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Experience the History 🛒
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Handpicked products that connect you to the story you just read.
        </p>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <div
            key={i}
            className="rounded-sm p-5 flex flex-col gap-3"
            style={{
              background: "hsl(24 15% 8%)",
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            {/* Product name */}
            <h3
              className="font-serif font-bold text-sm leading-snug"
              style={{ color: "hsl(40 55% 72%)" }}
            >
              {product.name}
            </h3>

            {/* Why it's historically relevant */}
            <p className="text-xs text-muted-foreground italic leading-relaxed flex-1">
              {product.reason}
            </p>

            {/* Price range badge */}
            <span
              className="self-start px-2 py-0.5 text-xs rounded-sm font-medium"
              style={{
                background: "rgba(212,168,83,0.12)",
                color: "hsl(40 55% 65%)",
                border: "1px solid rgba(212,168,83,0.2)",
              }}
            >
              {product.price_range}
            </span>

            {/* CTA button */}
            {product.amazon_search_url ? (
              <a
                href={product.amazon_search_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
                style={{
                  background: "hsl(40 55% 38%)",
                  color: "hsl(24 18% 4%)",
                }}
              >
                Find on Amazon →
              </a>
            ) : (
              <a
                href={product.retailer_url}
                target="_blank"
                rel="noopener noreferrer"
                title={product.retailer_note}
                className="text-center px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
                style={{
                  background: "hsl(40 55% 38%)",
                  color: "hsl(24 18% 4%)",
                }}
              >
                Find at {product.retailer} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground mt-4 text-center opacity-60">
        As an Amazon Associate we earn from qualifying purchases.
        {/* Sign up at affiliate-program.amazon.com and replace 'foodchronicle-20' with your actual Associate ID */}
      </p>
    </section>
  );
}
