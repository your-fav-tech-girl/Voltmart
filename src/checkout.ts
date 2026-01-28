import "./style.css";
import { products } from "./data/product";

type CartItem = { id: string; qty: number };
const CART_KEY = "voltmart_cart_v1";
const ORDERS_KEY = "voltmart_orders_v1";

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadOrders(): any[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders: any[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function subtotal(cart: CartItem[]) {
  return cart.reduce((sum, i) => {
    const p = products.find((x) => x.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(
    "checkout-form",
  ) as HTMLFormElement | null;
  const status = document.getElementById("checkout-status");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = loadCart();
    if (cart.length === 0) {
      if (status) status.textContent = "Your cart is empty.";
      return;
    }

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const address = String(fd.get("address") || "").trim();

    const sub = subtotal(cart);
    const shipping = sub > 0 ? 10 : 0;
    const total = sub + shipping;

    const order = {
      id: "order_" + Date.now(),
      createdAt: new Date().toISOString(),
      customer: { name, email, phone, address },
      items: cart,
      subtotal: sub,
      shipping,
      total,
    };

    const orders = loadOrders();
    orders.unshift(order);
    saveOrders(orders);

    // clear cart
    saveCart([]);

    if (status)
      status.textContent = "Order placed successfully ✅ Redirecting...";

    // ✅ redirect AFTER saving
    window.location.href = "/summary.html";
  });
});
