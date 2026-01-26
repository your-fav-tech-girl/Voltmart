import "./style.css";
import { products, type Product } from "./data/product";
declare const lucide: { createIcons: () => void };

function animateTrustBar() {
  const counters = document.querySelectorAll<HTMLElement>(
    "#trust-bar [data-target]",
  );

  counters.forEach((el) => {
    const target = parseFloat(el.dataset.target || "0");
    const isDecimal = el.dataset.decimal === "true";
    const suffix = el.dataset.suffix || "";

    const duration = 1200;
    const startTime = performance.now();

    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = target * progress;

      el.textContent = isDecimal
        ? value.toFixed(1) + suffix
        : Math.floor(value).toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

document.addEventListener("DOMContentLoaded", animateTrustBar);

function productCard(p: Product) {
  return `
    <article class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      <img src="${p.image}" alt="${p.title}" class="w-full h-52 object-cover"/>
      <div class="p-5">
        <p class="text-xs text-gray-500">${p.category}</p>
        <h3 class="font-semibold text-lg mt-1">${p.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${p.description}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="font-semibold">${formatMoney(p.price)}</span>
          <button
  data-add="${p.id}"
  class="px-4 py-2 rounded-xl bg-yellow-600 text-white hover:bg-gray-800 transition text-sm font-medium"
>
  Add to cart
</button>

        </div>
      </div>
    </article>
  `;
}

function renderGrid(list: Product[]) {
  const grid = document.getElementById("products-grid");
  const status = document.getElementById("products-status");

  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = "";
    if (status) status.textContent = "No products found.";
    return;
  }

  if (status) status.textContent = "";
  grid.innerHTML = list.map(productCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid(products);

  const searchInput = document.getElementById(
    "search",
  ) as HTMLInputElement | null;

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = products.filter((p) =>
      `${p.title} ${p.category} ${p.description}`.toLowerCase().includes(q),
    );
    renderGrid(filtered);
  });
});

type CartItem = { id: string; qty: number };

const CART_KEY = "voltmart_cart_v1";

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

function getCartCount(cart: CartItem[]) {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal(cart: CartItem[]) {
  return cart.reduce((sum, i) => {
    const product = products.find((p) => p.id === i.id);
    return sum + (product ? product.price * i.qty : 0);
  }, 0);
}

function showToast(message = "Added to cart ✅") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 1200);
}
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  lucide.createIcons();

  document.getElementById("cart-open")?.addEventListener("click", openCart);
});

function openCart() {
  document.getElementById("cart-drawer")?.classList.remove("translate-x-full");
  document.getElementById("cart-backdrop")?.classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.add("translate-x-full");
  document.getElementById("cart-backdrop")?.classList.add("hidden");
}

function renderCart() {
  const cart = loadCart();
  const itemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const countEl = document.getElementById("cart-count");

  if (countEl) countEl.textContent = String(getCartCount(cart));
  if (subtotalEl) subtotalEl.textContent = formatMoney(getSubtotal(cart));

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="text-gray-500 text-sm">Your cart is empty.</p>`;
    lucide.createIcons();
    return;
  }

  itemsEl.innerHTML = cart
    .map((item) => {
      const p = products.find((x) => x.id === item.id);
      if (!p) return "";

      return `
        <div class="flex gap-3 items-center">
          <img src="${p.image}" alt="${p.title}" class="w-14 h-14 rounded-lg object-cover border border-gray-200"/>
          <div class="flex-1">
            <p class="font-medium">${p.title}</p>
            <p class="text-sm text-gray-500">${formatMoney(p.price)}</p>

            <div class="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
              <button
  data-dec="${p.id}"
  class="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center"
>
  <i data-lucide="minus" class="w-4 h-4"></i>
</button>

<span class="text-sm w-6 text-center">${item.qty}</span>

<button
  data-inc="${p.id}"
  class="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center"
>
  <i data-lucide="plus" class="w-4 h-4"></i>
</button>

            </div>
          </div>

         <button
  data-remove="${p.id}"
  class="text-red-600 hover:text-red-700 transition"
>
  <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
</button>

        </div>
      `;
    })
    .join("");
  lucide.createIcons();
}

// --- EVENTS ---
document.addEventListener("DOMContentLoaded", () => {
  // initial cart render
  renderCart();
  // refresh icons
  // @ts-ignore

  // open/close drawer
  document.getElementById("cart-open")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document
    .getElementById("cart-backdrop")
    ?.addEventListener("click", closeCart);

  // add to cart + cart actions (event delegation)
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;

    // Add
    const addId = t.getAttribute("data-add");
    if (addId) {
      const cart = loadCart();
      const found = cart.find((i) => i.id === addId);
      if (found) found.qty += 1;
      else cart.push({ id: addId, qty: 1 });
      saveCart(cart);

      renderCart();
      showToast();
      return;
    }

    // Increase
    const incId = t.getAttribute("data-inc");
    if (incId) {
      const cart = loadCart();
      const found = cart.find((i) => i.id === incId);
      if (found) found.qty += 1;
      saveCart(cart);
      renderCart();
      return;
    }

    // Decrease
    const decId = t.getAttribute("data-dec");
    if (decId) {
      const cart = loadCart();
      const found = cart.find((i) => i.id === decId);
      if (found) {
        found.qty -= 1;
        const next = found.qty <= 0 ? cart.filter((i) => i.id !== decId) : cart;
        saveCart(next);
        renderCart();
      }
      return;
    }

    // Remove
    const removeId = t.getAttribute("data-remove");
    if (removeId) {
      const cart = loadCart().filter((i) => i.id !== removeId);
      saveCart(cart);
      renderCart();
      return;
    }
  });
});
function formatMoney(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
