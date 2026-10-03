export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  priceDisplay: string;
  regularPrice: number;
  category: string;
  badge: string;
  packSize?: string;
  rating?: number;
  inStock?: boolean;
}

export const PRODUCTS: Product[] = [
  // Initial 6 Reference Screenshot Products
  {
    id: 12,
    title: "Premium কিশমিশ Natural Sweet Dry Fruit",
    image: "/uploads/products/product-12.png",
    price: 190,
    priceDisplay: "190৳ – 649৳",
    regularPrice: 649,
    category: "nuts-fruits",
    badge: "-6%",
    packSize: "500g",
    rating: 5,
    inStock: true
  },
  {
    id: 14,
    title: "অর্গানিক কাজুবাদাম Premium Crunchy Natural Nuts",
    image: "/uploads/products/product-14.png",
    price: 350,
    priceDisplay: "350৳ – 1,240৳",
    regularPrice: 1240,
    category: "nuts-fruits",
    badge: "-6%",
    packSize: "500g",
    rating: 5,
    inStock: true
  },
  {
    id: 8,
    title: "Premium Chia Seed Natural Superfood Pack",
    image: "/uploads/products/product-8.png",
    price: 130,
    priceDisplay: "130৳ – 499৳",
    regularPrice: 499,
    category: "superfoods",
    badge: "-8%",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 2,
    title: "Natural Brown Sugar Premium Unrefined Sweetener",
    image: "/uploads/products/product-2.png",
    price: 190,
    priceDisplay: "190৳ – 360৳",
    regularPrice: 360,
    category: "sweeteners",
    badge: "",
    packSize: "1kg",
    rating: 5,
    inStock: true
  },
  {
    id: 17,
    title: "প্রিমিয়াম খেজুরের গুড় Best Natural Deshi Taste",
    image: "/uploads/products/product-khejurer-gur.jpg",
    price: 289,
    oldPrice: 320,
    priceDisplay: "320৳ 289৳",
    regularPrice: 320,
    category: "sweeteners",
    badge: "-10%",
    packSize: "400g",
    rating: 5,
    inStock: true
  },
  {
    id: 3,
    title: "Organic Chola Boot Premium Selected Grade",
    image: "/uploads/products/product-3.png",
    price: 120,
    priceDisplay: "120৳ – 450৳",
    regularPrice: 450,
    category: "dal-pulses",
    badge: "",
    packSize: "1kg",
    rating: 5,
    inStock: true
  },

  // Spices & Masala (Total 6)
  {
    id: 1,
    title: "Fresh ধনিয়া গুঁড়া Natural Aroma Pack",
    image: "/uploads/products/product-1.png",
    price: 100,
    priceDisplay: "100৳ – 420৳",
    regularPrice: 420,
    category: "spices-masala",
    badge: "",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 4,
    title: "Organic Turmeric Powder Premium Grade Pack",
    image: "/uploads/products/product-4.png",
    price: 120,
    priceDisplay: "120৳ – 470৳",
    regularPrice: 470,
    category: "spices-masala",
    badge: "-6%",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 5,
    title: "Organic কালোজিরা Seed Premium Natural Pack",
    image: "/uploads/products/product-5.png",
    price: 110,
    priceDisplay: "110৳ – 460৳",
    regularPrice: 460,
    category: "spices-masala",
    badge: "",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 9,
    title: "Premium Cumin Powder 100% Natural Spice",
    image: "/uploads/products/product-9.png",
    price: 190,
    priceDisplay: "190৳ – 799৳",
    regularPrice: 799,
    category: "spices-masala",
    badge: "-6%",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 16,
    title: "দেশি খাঁটি মরিচ গুঁড়া প্রিমিয়াম কোয়ালিটি",
    image: "/uploads/products/product-16.png",
    price: 140,
    priceDisplay: "140৳ – 550৳",
    regularPrice: 550,
    category: "spices-masala",
    badge: "-7%",
    packSize: "250g",
    rating: 5,
    inStock: true
  },
  {
    id: 18,
    title: "Premium Garam Masala Whole Spice Blend",
    image: "/uploads/products/product-1.png",
    price: 180,
    priceDisplay: "180৳ – 520৳",
    regularPrice: 520,
    category: "spices-masala",
    badge: "",
    packSize: "200g",
    rating: 5,
    inStock: true
  },

  // Dal & Pulses (Remaining 2 to make 3 total)
  {
    id: 10,
    title: "Premium Masoor Dal Fresh Selected Quality",
    image: "/uploads/products/product-10.png",
    price: 115,
    priceDisplay: "115৳ – 430৳",
    regularPrice: 430,
    category: "dal-pulses",
    badge: "",
    packSize: "1kg",
    rating: 5,
    inStock: true
  },
  {
    id: 19,
    title: "Premium Moong Dal Special Washed Quality",
    image: "/uploads/products/product-6.png",
    price: 145,
    priceDisplay: "145৳ – 480৳",
    regularPrice: 480,
    category: "dal-pulses",
    badge: "",
    packSize: "1kg",
    rating: 5,
    inStock: true
  },

  // Rice (2)
  {
    id: 7,
    title: "Premium Basmati Rice Long Grain Aromatic",
    image: "/uploads/products/product-7.png",
    price: 330,
    priceDisplay: "330৳ – 1,450৳",
    regularPrice: 1450,
    category: "rice",
    badge: "-6%",
    packSize: "5kg",
    rating: 5,
    inStock: true
  },
  {
    id: 20,
    title: "Chinigura Aromatic Rice Premium Deshi Polao",
    image: "/uploads/products/product-7.png",
    price: 160,
    priceDisplay: "160৳ – 780৳",
    regularPrice: 780,
    category: "rice",
    badge: "",
    packSize: "1kg",
    rating: 5,
    inStock: true
  },

  // Organic Foods (1)
  {
    id: 13,
    title: "Premium গাওয়া ঘি 100% Pure Quality",
    image: "/uploads/products/product-13.png",
    price: 420,
    priceDisplay: "420৳ – 1,390৳",
    regularPrice: 1390,
    category: "organic-foods",
    badge: "-6%",
    packSize: "500g",
    rating: 5,
    inStock: true
  },

  // Flour & Atta (1)
  {
    id: 6,
    title: "Organic লাল আটা Fresh Whole Wheat Pack",
    image: "/uploads/products/product-6.png",
    price: 95,
    priceDisplay: "95৳ – 399৳",
    regularPrice: 399,
    category: "flour-atta",
    badge: "-7%",
    packSize: "2kg",
    rating: 5,
    inStock: true
  },

  // Cooking Oil (1)
  {
    id: 11,
    title: "Premium Organic Mustard Oil 1 Liter",
    image: "/uploads/products/product-11.png",
    price: 420,
    priceDisplay: "420৳",
    regularPrice: 420,
    category: "cooking-oil",
    badge: "-7%",
    packSize: "1L",
    rating: 5,
    inStock: true
  },

  // Honey (for full catalog completeness)
  {
    id: 15,
    title: "খাঁটি সুন্দরবনের প্রাকৃতিক মধু ৫০০ গ্রাম",
    image: "/uploads/products/product-15.png",
    price: 690,
    priceDisplay: "690৳",
    regularPrice: 690,
    category: "honey",
    badge: "-9%",
    packSize: "500g",
    rating: 5,
    inStock: true
  }
];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  );
}
