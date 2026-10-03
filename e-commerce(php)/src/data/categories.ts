export interface Category {
  id: string;
  name: string;
  nameBn: string;
  image: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "spices-masala",
    name: "Spices & Masala",
    nameBn: "মসলা গুঁড়া",
    image: "/uploads/products/product-4.png",
    count: 6
  },
  {
    id: "dal-pulses",
    name: "Dal & Pulses",
    nameBn: "ডাল ও ডালজাতীয়",
    image: "/uploads/assets/cat-dal.png",
    count: 3
  },
  {
    id: "nuts-fruits",
    name: "Nuts & Fruits",
    nameBn: "বাদাম ও কিশমিশ",
    image: "/uploads/assets/cat-nuts.png",
    count: 2
  },
  {
    id: "sweeteners",
    name: "Sweeteners",
    nameBn: "প্রাকৃতিক মিষ্টি",
    image: "/uploads/products/product-2.png",
    count: 2
  },
  {
    id: "rice",
    name: "Rice",
    nameBn: "সুগন্ধি চাল",
    image: "/uploads/products/product-7.png",
    count: 2
  },
  {
    id: "organic-foods",
    name: "Organic Foods",
    nameBn: "অর্গানিক ফুডস",
    image: "/uploads/assets/cat-organic.png",
    count: 1
  },
  {
    id: "superfoods",
    name: "Superfoods",
    nameBn: "সুপারফুড",
    image: "/uploads/products/product-8.png",
    count: 1
  },
  {
    id: "flour-atta",
    name: "Flour & Atta",
    nameBn: "আটা ও ময়দা",
    image: "/uploads/assets/cat-flour.png",
    count: 1
  },
  {
    id: "cooking-oil",
    name: "Cooking Oil",
    nameBn: "খাঁটি তেল",
    image: "/uploads/assets/cat-oil.png",
    count: 1
  },
  {
    id: "honey",
    name: "Honey",
    nameBn: "খাঁটি মধু",
    image: "/uploads/assets/cat-honey.png",
    count: 1
  }
];

export const NAV_CATEGORIES = [
  { id: "honey", name: "Honey" },
  { id: "nuts-fruits", name: "Nuts & Fruits" },
  { id: "cooking-oil", name: "Cooking Oil" },
  { id: "dal-pulses", name: "Dal & Pulses" },
  { id: "flour-atta", name: "Flour & Atta" },
  { id: "spices-masala", name: "Spices & Masala" },
  { id: "rice", name: "Rice" },
  { id: "sweeteners", name: "Sweeteners" },
  { id: "superfoods", name: "Superfoods" },
  { id: "organic-foods", name: "Organic Foods" }
];
