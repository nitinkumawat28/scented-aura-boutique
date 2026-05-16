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
    id: "amber-noir",
    name: "Amber Noir",
    tagline: "Eau de Parfum · 100ml",
    description:
      "A warm, enveloping amber composition layered with smoked vanilla and aged sandalwood. An ode to candlelit evenings.",
    price: 185,
    image: p1,
    category: "Oriental",
    notes: {
      top: ["Bergamot", "Pink Pepper", "Cardamom"],
      heart: ["Rose Absolute", "Saffron", "Iris"],
      base: ["Amber", "Sandalwood", "Vanilla Bourbon"],
    },
  },
  {
    id: "violette-dusk",
    name: "Violette Dusk",
    tagline: "Eau de Parfum · 100ml",
    description:
      "Powdered violets bloom against a backdrop of dried lavender and warm leather, recalling old Parisian boudoirs.",
    price: 210,
    image: p2,
    category: "Floral",
    notes: {
      top: ["Lavender", "Bergamot", "Violet Leaf"],
      heart: ["Violet", "Heliotrope", "Orris"],
      base: ["Suede", "Tonka Bean", "Cedarwood"],
    },
  },
  {
    id: "miel-doré",
    name: "Miel Doré",
    tagline: "Eau de Parfum · 100ml",
    description:
      "Golden honey drizzled over sun-warmed neroli and beeswax. Soft, radiant, and quietly opulent.",
    price: 168,
    image: p3,
    category: "Gourmand",
    notes: {
      top: ["Neroli", "Orange Blossom", "Mandarin"],
      heart: ["Honey", "Jasmine", "Mimosa"],
      base: ["Beeswax", "Tonka", "Musk"],
    },
  },
  {
    id: "rose-héritage",
    name: "Rose Héritage",
    tagline: "Extrait de Parfum · 50ml",
    description:
      "A heritage rose chypre laced with dried petals, oud, and patchouli. Timeless, regal, unforgettable.",
    price: 245,
    image: p4,
    category: "Chypre",
    notes: {
      top: ["Bulgarian Rose", "Lychee", "Pear"],
      heart: ["Damask Rose", "Peony", "Magnolia"],
      base: ["Oud", "Patchouli", "White Musk"],
    },
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
