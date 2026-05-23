import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  category: string;
  notes: { top: string[]; heart: string[]; base: string[] };
}

export const products: Product[] = [
  {
    id: "dark-amber",
    name: "Dark Amber",
    tagline: "Eau de Parfum · 100ml",
    description:
      "A warm, enveloping amber composition layered with smoked vanilla and aged sandalwood. An ode to candlelit evenings.",
    price: 15500,
    image: p1,
    category: "Oriental",
    notes: {
      top: ["Bergamot", "Pink Pepper", "Cardamom"],
      heart: ["Rose Absolute", "Saffron", "Iris"],
      base: ["Amber", "Sandalwood", "Vanilla Bourbon"],
    },
  },
  {
    id: "violet-dusk",
    name: "Violet Dusk",
    tagline: "Eau de Parfum · 100ml",
    description:
      "Powdered violets bloom against a backdrop of dried lavender and warm leather, recalling old Parisian boudoirs.",
    price: 17500,
    image: p2,
    category: "Floral",
    notes: {
      top: ["Lavender", "Bergamot", "Violet Leaf"],
      heart: ["Violet", "Heliotrope", "Orris"],
      base: ["Suede", "Tonka Bean", "Cedarwood"],
    },
  },
  {
    id: "golden-honey",
    name: "Golden Honey",
    tagline: "Eau de Parfum · 100ml",
    description:
      "Golden honey drizzled over sun-warmed neroli and beeswax. Soft, radiant, and quietly opulent.",
    price: 14000,
    image: p3,
    category: "Gourmand",
    notes: {
      top: ["Neroli", "Orange Blossom", "Mandarin"],
      heart: ["Honey", "Jasmine", "Mimosa"],
      base: ["Beeswax", "Tonka", "Musk"],
    },
  },
  {
    id: "heritage-rose",
    name: "Heritage Rose",
    tagline: "Extrait de Parfum · 50ml",
    description:
      "A heritage rose chypre laced with dried petals, oud, and patchouli. Timeless, regal, unforgettable.",
    price: 20500,
    image: p4,
    category: "Chypre",
    notes: {
      top: ["Bulgarian Rose", "Lychee", "Pear"],
      heart: ["Damask Rose", "Peony", "Magnolia"],
      base: ["Oud", "Patchouli", "White Musk"],
    },
  },
  {
    id: "precious-oud",
    name: "Precious Oud",
    tagline: "Extrait de Parfum · 50ml",
    description:
      "Deep, rich agarwood blended with spicy saffron and dark chocolate notes. A scent of pure royalty.",
    price: 22000,
    image: p1,
    category: "Oriental",
    notes: {
      top: ["Saffron", "Nutmeg", "Lavender"],
      heart: ["Agarwood", "Dark Chocolate", "Rose"],
      base: ["Patchouli", "Musk", "Incense"],
    },
  },
  {
    id: "night-jasmine",
    name: "Night Jasmine",
    tagline: "Eau de Parfum · 100ml",
    description:
      "The intoxicating scent of jasmine blooming under moonlight, softened by creamy almond and white woods.",
    price: 16000,
    image: p2,
    category: "Floral",
    notes: {
      top: ["Almond", "Blackcurrant", "Green Leaves"],
      heart: ["Night-Blooming Jasmine", "Tuberose", "Lily of the Valley"],
      base: ["White Woods", "Vanilla", "Musk"],
    },
  },
  {
    id: "cedar-wood",
    name: "Cedar Wood",
    tagline: "Eau de Parfum · 100ml",
    description:
      "Crisp, dry cedar wood enhanced by a touch of black pepper and vetiver. Grounding and intensely refined.",
    price: 15000,
    image: p3,
    category: "Woody",
    notes: {
      top: ["Black Pepper", "Grapefruit", "Coriander"],
      heart: ["Cedarwood", "Vetiver", "Iris"],
      base: ["Oakmoss", "Leather", "Amber"],
    },
  },
  {
    id: "vine-flower",
    name: "Vine Flower",
    tagline: "Eau de Parfum · 100ml",
    description:
      "A refreshing burst of grape blossom, intertwined with green fig and light citrus notes.",
    price: 18000,
    image: p4,
    category: "Floral",
    notes: {
      top: ["Grapefruit", "Bergamot", "Lemon"],
      heart: ["Vine Blossom", "Fig Leaf", "Rose Water"],
      base: ["White Musk", "Cedar", "Vetiver"],
    },
  }
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
