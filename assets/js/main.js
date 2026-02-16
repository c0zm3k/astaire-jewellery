// Astaire Fine Jewellery - Cart & Interaction Logic
const Cart = {
    items: JSON.parse(localStorage.getItem('astaire_cart')) || [],

    save() {
        localStorage.setItem('astaire_cart', JSON.stringify(this.items));
        this.updateBadge();
    },

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id && item.size === product.size);
        if (existing) {
            existing.quantity += product.quantity;
        } else {
            this.items.push(product);
        }
        this.save();
        this.notify(`Added ${product.name} to cart`);
    },

    removeItem(id, size) {
        this.items = this.items.filter(item => {
            const match = item.id === id && (item.size === size || (!item.size && !size));
            return !match;
        });
        this.save();
        this.renderCart();
        this.renderOrderSummary();
    },

    updateQuantity(id, size, delta) {
        const item = this.findItem(id, size);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) return this.removeItem(id, size);
            this.save();
            this.renderCart();
            this.renderOrderSummary();
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateBadge() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cartCount').forEach(badge => {
            badge.innerText = count;
            badge.classList.toggle('hidden', count === 0);
        });
    },

    notify(msg) {
        const toast = document.createElement('div');
        // Updated to Peach/Luxury Aesthetic
        toast.className = 'fixed bottom-8 right-8 bg-white border border-peach-solid text-stone-800 px-8 py-4 shadow-xl z-[100] transition-all transform translate-y-20 serif italic';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.remove('translate-y-20'), 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="text-center py-20 text-stone-400 serif italic text-xl">Your cart is empty.</div>';
            const summary = document.getElementById('cartSummaryContainer');
            if (summary) summary.classList.add('hidden');
            return;
        }

        const summary = document.getElementById('cartSummaryContainer');
        if (summary) summary.classList.remove('hidden');

        container.innerHTML = this.items.map(item => `
            <div class="flex flex-col sm:flex-row gap-8 pb-12 border-b border-peach/30">
                <img src="${item.image}" class="w-32 h-40 object-cover bg-peach-light p-2 shadow-sm" alt="${item.name}">
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl serif italic">${item.name}</h3>
                            <p class="text-[10px] uppercase tracking-widest text-stone-400 mt-2">${item.size || 'Fine Jewellery'}</p>
                        </div>
                        <button onclick="Cart.removeItem('${item.id}', '${item.size || ''}')" class="text-stone-400 hover:text-peach-dark transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="flex justify-between items-center mt-6">
                        <div class="flex items-center border border-peach px-4 py-2 space-x-4">
                            <button onclick="Cart.updateQuantity('${item.id}', '${item.size || ''}', -1)" class="text-stone-400 hover:text-stone-800">-</button>
                            <span class="text-xs">${item.quantity}</span>
                            <button onclick="Cart.updateQuantity('${item.id}', '${item.size || ''}', 1)" class="text-stone-400 hover:text-stone-800">+</button>
                        </div>
                        <p class="text-lg font-light tracking-widest text-stone-500">$${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateTotals();
    },

    renderOrderSummary() {
        const container = document.getElementById('orderItems');
        if (!container) return;

        container.innerHTML = this.items.map(item => `
            <div class="flex gap-4">
                <img src="${item.image}" class="w-16 h-20 object-cover bg-peach-light p-1 shadow-sm" alt="${item.name}">
                <div class="flex-1 flex justify-between items-center">
                    <div>
                        <h3 class="text-sm serif italic">${item.name}</h3>
                        <p class="text-[9px] text-stone-400 uppercase tracking-widest mt-1">Qty: ${item.quantity}</p>
                    </div>
                    <span class="text-sm tracking-widest text-stone-500">$${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
        `).join('');

        this.updateTotals();
    },

    updateTotals() {
        const total = this.getTotal();
        const formattedTotal = `$${total.toLocaleString()}`;
        ['subtotal', 'total', 'finalTotal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = formattedTotal;
        });
    },

    findItem(id, size) {
        return this.items.find(item => item.id === id && (item.size === size || (!item.size && !size)));
    },

    placeOrder() {
        if (this.items.length === 0) {
            this.notify("Your cart is empty. Nothing to order.");
            return;
        }
        
        // Generate Order ID
        const orderId = 'AST-' + Math.floor(1000 + Math.random() * 9000);
        const orderDate = new Date().toLocaleDateString();
        
        const newOrder = {
            id: orderId,
            date: orderDate,
            items: [...this.items],
            total: this.getTotal(),
            status: 'Processing'
        };

        // Save to Orders History
        const orders = JSON.parse(localStorage.getItem('astaire_orders')) || [];
        orders.push(newOrder);
        localStorage.setItem('astaire_orders', JSON.stringify(orders));
        
        this.notify("Order " + orderId + " placed successfully!");
        
        // Clear cart
        this.items = [];
        this.save();
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${orderId}`;
        }, 1200);
    },

    lookupOrder(id) {
        const orders = JSON.parse(localStorage.getItem('astaire_orders')) || [];
        return orders.find(o => o.id.toUpperCase() === id.toUpperCase());
    }
};

// Filtering Logic
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('text-peach-dark', 'font-bold');
            btn.classList.remove('text-stone-400');
        } else {
            btn.classList.remove('text-peach-dark', 'font-bold');
            btn.classList.add('text-stone-400');
        }
    });

    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.opacity = '0';
            setTimeout(() => product.style.opacity = '1', 50);
        } else {
            product.style.display = 'none';
        }
    });
}

// Global Quantity Manager (for product-details.html)
let currentQty = 1;
function updateDetailQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    const el = document.getElementById('qty-val');
    if (el) el.innerText = currentQty;
}

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
    Cart.renderCart();
    Cart.renderOrderSummary();

    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('opacity-0', 'pointer-events-none'), 800);
        });
    }

    // Default Filter
    if (document.querySelector('.product-card')) {
        filterProducts('all');
    }
});

// Export Global Functions
window.Cart = Cart;
window.filterProducts = filterProducts;
window.updateDetailQty = updateDetailQty;
