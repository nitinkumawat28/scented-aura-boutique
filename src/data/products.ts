import royalOud from "@/assets/products/royal-oud.png";
import kashmiriSaffron from "@/assets/products/kashmiri-saffron.png";
import mograAbsolute from "@/assets/products/mogra-absolute.png";
import mysoreSandalwood from "@/assets/products/mysore-sandalwood.png";
import darjeelingTea from "@/assets/products/darjeeling-tea.png";
import malabarSpice from "@/assets/products/malabar-spice.png";
import monsoonRain from "@/assets/products/monsoon-rain.png";
import varanasiRose from "@/assets/products/varanasi-rose.png";

export interface Product {
  id: string;
  name: string;
  price: number;
  tagline: string; // Short Description
  description: string; // Long Description
  category: string;
  image: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  stock: number;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "royal-oud",
    name: "Royal Oud",
    price: 2999,
    tagline: "Warm woody fragrance",
    description: "A majestic blend of deep agarwood (oud) layered with velvety red rose and warm rich amber, evoking the timeless grandeur of royal palaces.",
    category: "Signature",
    image: royalOud,
    notes: {
      top: ["Oud", "Saffron"],
      heart: ["Rose", "Geranium"],
      base: ["Amber", "Sandalwood"]
    },
    stock: 45,
    featured: true
  },
  {
    id: "kashmiri-saffron",
    name: "Kashmiri Saffron",
    price: 3499,
    tagline: "Exotic spicy floral",
    description: "Deep saffron and golden honey from the valleys. An elegant composition of handpicked Kashmiri saffron steeped in warm wild honey and rich sandalwood.",
    category: "Exotic",
    image: kashmiriSaffron,
    notes: {
      top: ["Saffron", "Ginger"],
      heart: ["Honey", "Jasmine"],
      base: ["Sandalwood", "Patchouli"]
    },
    stock: 30,
    featured: true
  },
  {
    id: "mogra-absolute",
    name: "Mogra Absolute",
    price: 2799,
    tagline: "Radiant white floral",
    description: "Night-blooming Indian jasmine and fresh greens. A rich, intoxicating bouquet of fresh Mogra flowers harvested at dusk, balanced with delicate white musk.",
    category: "Floral",
    image: mograAbsolute,
    notes: {
      top: ["Green Leaves", "Neroli"],
      heart: ["Jasmine Mogra", "Tuberose"],
      base: ["White Musk", "Cedarwood"]
    },
    stock: 55,
    featured: true
  },
  {
    id: "mysore-sandalwood",
    name: "Mysore Sandalwood",
    price: 3899,
    tagline: "Rich creamy woody",
    description: "Sacred and grounding sandalwood with vanilla notes. Made with precious royal Mysore sandalwood, offering a smooth, creamy, woody aroma sweetened with vanilla.",
    category: "Woody",
    image: mysoreSandalwood,
    notes: {
      top: ["Cardamom", "Black Pepper"],
      heart: ["Sandalwood", "Cedarwood"],
      base: ["Vanilla Bourbon", "Amber"]
    },
    stock: 25,
    featured: true
  },
  {
    id: "darjeeling-tea",
    name: "Darjeeling Tea",
    price: 2599,
    tagline: "Fresh citrus aromatic",
    description: "First flush black tea leaves and green bergamot. A refreshing and sophisticated aroma of freshly brewed black tea leaves mixed with bright, crisp Italian bergamot.",
    category: "Fresh",
    image: darjeelingTea,
    notes: {
      top: ["Bergamot", "Lemon"],
      heart: ["Black Tea", "Maté"],
      base: ["Vetiver", "White Musk"]
    },
    stock: 60,
    featured: false
  },
  {
    id: "malabar-spice",
    name: "Malabar Spice",
    price: 2899,
    tagline: "Warm exotic spicy",
    description: "Black pepper and fresh cardamom from the coast. A vibrant, energizing blend of sun-baked black peppercorns, green cardamom, and dry cedarwood.",
    category: "Spicy",
    image: malabarSpice,
    notes: {
      top: ["Black Pepper", "Coriander"],
      heart: ["Cardamom", "Nutmeg"],
      base: ["Cedarwood", "Patchouli"]
    },
    stock: 40,
    featured: false
  },
  {
    id: "monsoon-rain",
    name: "Monsoon Rain",
    price: 2699,
    tagline: "Earthy fresh green",
    description: "The scent of first rain on sun-baked clay. Capture the ethereal petrichor scent of monsoon rain touching the earth, layered with grounding vetiver.",
    category: "Fresh",
    image: monsoonRain,
    notes: {
      top: ["Rain Accord", "Bergamot"],
      heart: ["Petrichor", "Green Leaves"],
      base: ["Vetiver", "Patchouli"]
    },
    stock: 35,
    featured: false
  },
  {
    id: "varanasi-rose",
    name: "Varanasi Rose",
    price: 3299,
    tagline: "Velvet floral chypre",
    description: "Heritage roses steeped in incense and patchouli. An ancient, mystical floral scent that pairs fresh, velvety Damask rose with spiritual temple incense.",
    category: "Signature",
    image: varanasiRose,
    notes: {
      top: ["Damask Rose", "Bergamot"],
      heart: ["Incense", "Myrrh"],
      base: ["Patchouli", "Sandalwood"]
    },
    stock: 50,
    featured: true
  }
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
