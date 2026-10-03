import type { Product } from '../data/products';
import { getProductById } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface CartState {
  items: CartItem[];
  deliveryZone: DeliveryZone;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

const STORAGE_KEY = 'falaqfood_cart_v1';

class CartStore {
  private items: CartItem[] = [];
  private deliveryZone: DeliveryZone = 'inside_dhaka';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) {
          this.items = parsed.items
            .map((item: { productId: number; quantity: number }) => {
              const product = getProductById(item.productId);
              return product ? { product, quantity: item.quantity } : null;
            })
            .filter((i: CartItem | null): i is CartItem => i !== null);
        }
        if (parsed.deliveryZone) {
          this.deliveryZone = parsed.deliveryZone;
        }
      }
    } catch {
      this.items = [];
    }
  }

  private save() {
    try {
      const toSave = {
        items: this.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        deliveryZone: this.deliveryZone
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }

  private notify() {
    this.save();
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public getItemCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  public getDeliveryZone(): DeliveryZone {
    return this.deliveryZone;
  }

  public setDeliveryZone(zone: DeliveryZone) {
    this.deliveryZone = zone;
    this.notify();
  }

  public getDeliveryFee(): number {
    return this.deliveryZone === 'inside_dhaka' ? 70 : 130;
  }

  public getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  public getTotal(): number {
    const sub = this.getSubtotal();
    if (sub === 0) return 0;
    return sub + this.getDeliveryFee();
  }

  public addItem(product: Product, quantity = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.notify();
  }

  public updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.notify();
    }
  }

  public removeItem(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.notify();
  }

  public clear() {
    this.items = [];
    this.notify();
  }
}

export const cartStore = new CartStore();
