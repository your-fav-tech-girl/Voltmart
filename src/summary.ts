import "./style.css";
import { products } from "./data/product";

type CartItem = { id: string; qty: number };
const ORDERS_KEY = "voltmart_orders_v1";

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);

function loadOrders(): any[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderSummary() {
  const itemsEl = document.getElementById("summary-items");
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");

  const nameEl = document.getElementById("summary-name");
  const emailEl = document.getElementById("summary-email");
  const phoneEl = document.getElementById("summary-phone");
  const addressEl = document.getElementById("summary-address");

  if (!itemsEl || !subtotalEl || !shippingEl || !totalEl) return;

  const orders = loadOrders();
  const order = orders[0];

  if (!order) {
    itemsEl.innerHTML = `<p class="text-gray-600">No recent order found.</p>`;
    subtotalEl.textContent = formatMoney(0);
    shippingEl.textContent = formatMoney(0);
    totalEl.textContent = formatMoney(0);
    return;
  }

  // optional: customer details
  if (nameEl) nameEl.textContent = order.customer?.name || "-";
  if (emailEl) emailEl.textContent = order.customer?.email || "-";
  if (phoneEl) phoneEl.textContent = order.customer?.phone || "-";
  if (addressEl) addressEl.textContent = order.customer?.address || "-";

  const items: CartItem[] = order.items || [];

  itemsEl.innerHTML = items
    .map((i) => {
      const p = products.find((x) => x.id === i.id);
      if (!p) return "";
      return `
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover border border-gray-200" />
            <div>
              <p class="font-medium text-sm">${p.title}</p>
              <p class="text-xs text-gray-500">Qty: ${i.qty}</p>
            </div>
          </div>
          <p class="text-sm font-medium">${formatMoney(p.price * i.qty)}</p>
        </div>
      `;
    })
    .join("");

  subtotalEl.textContent = formatMoney(order.subtotal ?? 0);
  shippingEl.textContent = formatMoney(order.shipping ?? 0);
  totalEl.textContent = formatMoney(order.total ?? 0);
}

document.addEventListener("DOMContentLoaded", renderSummary);
