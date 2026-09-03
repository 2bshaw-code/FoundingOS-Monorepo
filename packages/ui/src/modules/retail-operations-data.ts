/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared, synthetic demo data for FoundRetail's real operational views (POS/Inventory/
// Suppliers/Customers/Orders/Promotions/Inventory Alerts) — these nav links already existed in
// retail-console's sidebar but had no page behind any of them, silently falling through to a
// generic placeholder. Built with real, tailored fields per view, honest "sell anything in
// minutes" demo content — no real payment processor, no real stock system, clearly illustrative.

export type Product = { name: string; category: string; price: string; stock: number; reorderAt: number }
export const DEMO_PRODUCTS: Product[] = [
  { name: 'Everyday Tee', category: 'Apparel', price: '£14.00', stock: 84, reorderAt: 20 },
  { name: 'Canvas Tote', category: 'Accessories', price: '£9.50', stock: 12, reorderAt: 15 },
  { name: 'Ceramic Mug', category: 'Homeware', price: '£11.00', stock: 46, reorderAt: 10 },
  { name: 'Notebook — Ruled', category: 'Stationery', price: '£6.00', stock: 5, reorderAt: 12 },
]

export type Supplier = { name: string; leadTime: string; lastOrder: string; reliability: 'High' | 'Medium' | 'Low' }
export const DEMO_SUPPLIERS: Supplier[] = [
  { name: 'North Farm Textiles', leadTime: '5 days', lastOrder: '2026-08-20', reliability: 'High' },
  { name: 'Harbour Print Co.', leadTime: '3 days', lastOrder: '2026-08-27', reliability: 'High' },
  { name: 'Local Line Supplies', leadTime: '9 days', lastOrder: '2026-08-15', reliability: 'Medium' },
]

export type Customer = { name: string; email: string; orders: number; lifetimeSpend: string; lastOrder: string }
export const DEMO_CUSTOMERS: Customer[] = [
  { name: 'Northside Group', email: 'orders@northside.example', orders: 8, lifetimeSpend: '£412.00', lastOrder: '2026-08-30' },
  { name: 'Harbour Team', email: 'hello@harbour.example', orders: 3, lifetimeSpend: '£96.50', lastOrder: '2026-08-22' },
  { name: 'Priya Shah', email: 'priya@example.com', orders: 1, lifetimeSpend: '£14.00', lastOrder: '2026-09-01' },
]

export type Order = { id: string; customer: string; items: string; total: string; status: 'New' | 'Packed' | 'Shipped' | 'Delivered' }
export const DEMO_ORDERS: Order[] = [
  { id: '#1042', customer: 'Northside Group', items: '3x Everyday Tee', total: '£42.00', status: 'Shipped' },
  { id: '#1043', customer: 'Priya Shah', items: '1x Ceramic Mug', total: '£11.00', status: 'New' },
  { id: '#1041', customer: 'Harbour Team', items: '2x Canvas Tote', total: '£19.00', status: 'Delivered' },
]

export type Promotion = { name: string; discount: string; status: 'Active' | 'Scheduled' | 'Ended'; redemptions: number }
export const DEMO_PROMOTIONS: Promotion[] = [
  { name: 'Welcome — 10% off first order', discount: '10%', status: 'Active', redemptions: 34 },
  { name: 'Autumn Clearance', discount: '20%', status: 'Scheduled', redemptions: 0 },
  { name: 'Summer Sale', discount: '15%', status: 'Ended', redemptions: 118 },
]

export const DEMO_BASKET_ITEMS = [
  { name: 'Everyday Tee', price: 14.0 },
  { name: 'Ceramic Mug', price: 11.0 },
]
