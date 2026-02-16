// Astaire Fine Jewellery - Enhanced Shop Logic
export const Cart = {
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
        this.notify(`Added to Bag: ${product.name}`);
    },

    removeItem(id, size) {
        this.items = this.items.filter(item => {
            return !(item.id === id && (item.size === size || (!item.size && !size)));
        });
        this.save();
        this.renderCart();
        this.renderOrderSummary();
    },

    updateQuantity(id, size, delta) {
        const item = this.items.find(item => item.id === id && (item.size === size || (!item.size && !size)));
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
            badge.innerText = `(${count})`;
            badge.classList.toggle('opacity-30', count === 0);
        });
    },

    notify(msg) {
        const toast = document.createElement('div');
        // New Extreme Minimalist Toast
        toast.className = 'fixed top-12 left-1/2 -translate-x-1/2 bg-white px-12 py-6 shadow-2xl z-[100] transition-all transform -translate-y-20 flex items-center gap-6 reveal';
        toast.innerHTML = `
            <span class="text-[9px] tracking-[0.6em] uppercase text-stone-300">Notice</span>
            <span class="serif italic text-2xl text-stone-800">${msg}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.remove('-translate-y-20'), 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 800);
        }, 4000);
    },

    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="text-center py-40 serif italic text-4xl opacity-10">Empty.</div>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="flex flex-col md:flex-row gap-16 pb-16 mb-16 border-b border-stone-50 reveal">
                <div class="w-48 h-64 bg-brand-cream overflow-hidden">
                    <img src="${item.image}" class="w-full h-full object-cover" alt="${item.name}">
                </div>
                <div class="flex-1 flex flex-col justify-between py-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-3xl italic mb-4">${item.name}</h3>
                            <p class="text-[9px] uppercase tracking-[0.4em] text-stone-400">${item.size || 'Signature Series'}</p>
                        </div>
                        <button onclick="Cart.removeItem('${item.id}', '${item.size || ''}')" class="text-stone-300 hover:text-stone-800 transition-colors">
                            <span class="text-[9px] tracking-[0.2em] uppercase">Remove</span>
                        </button>
                    </div>
                    <div class="flex justify-between items-end mt-12">
                        <div class="flex items-center gap-10">
                            <button onclick="Cart.updateQuantity('${item.id}', '${item.size || ''}', -1)" class="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-stone-800 border-[0.5px] border-stone-100">-</button>
                            <span class="text-xs font-light tracking-widest">${item.quantity}</span>
                            <button onclick="Cart.updateQuantity('${item.id}', '${item.size || ''}', 1)" class="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-stone-800 border-[0.5px] border-stone-100">+</button>
                        </div>
                        <p class="text-2xl italic tracking-tighter text-stone-800">$${(item.price * item.quantity).toLocaleString()}</p>
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
            <div class="flex gap-10 mb-8 pb-8 border-b border-stone-50">
                <div class="w-16 h-20 bg-brand-cream overflow-hidden">
                    <img src="${item.image}" class="w-full h-full object-cover" alt="${item.name}">
                </div>
                <div class="flex-1 flex justify-between items-center">
                    <div>
                        <h3 class="text-sm italic">${item.name}</h3>
                        <p class="text-[8px] text-stone-300 uppercase tracking-widest mt-1">Qty: ${item.quantity}</p>
                    </div>
                    <span class="text-sm italic tracking-tighter text-stone-800">$${(item.price * item.quantity).toLocaleString()}</span>
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

    placeOrder() {
        if (this.items.length === 0) return;

        const orderId = 'AST-' + Math.floor(1000 + Math.random() * 9000);
        const orderDate = new Date().toLocaleDateString();

        const newOrder = {
            id: orderId,
            date: orderDate,
            items: [...this.items],
            total: this.getTotal(),
            status: 'Atelier Processing'
        };

        const orders = JSON.parse(localStorage.getItem('astaire_orders')) || [];
        orders.push(newOrder);
        localStorage.setItem('astaire_orders', JSON.stringify(orders));

        this.items = [];
        this.save();

        setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${orderId}`;
        }, 1200);
    },

    lookupOrder(id) {
        const orders = JSON.parse(localStorage.getItem('astaire_orders')) || [];
        return orders.find(o => o.id.toUpperCase() === id.toUpperCase());
    }
};

export function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('text-stone-800', 'font-medium');
            btn.classList.remove('text-stone-300');
        } else {
            btn.classList.remove('text-stone-800', 'font-medium');
            btn.classList.add('text-stone-300');
        }
    });

    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.classList.add('reveal');
        } else {
            product.style.display = 'none';
        }
    });
}

// Attach to window for legacy inline onclicks if needed, though we prefer modules
window.Cart = Cart;
window.filterProducts = filterProducts;
