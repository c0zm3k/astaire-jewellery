// Astaire Fine Jewellery - Cart Logic
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
            const match = item.id === id && (item.size === size || (!item.size && !size) || (item.size === 'Standard Size' && !size) || (!item.size && size === 'Standard Size'));
            return !match;
        });
        this.save();
        this.renderCart();
    },

    updateQuantity(id, size, delta) {
        const item = this.findItem(id, size);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) return this.removeItem(id, size);
            this.save();
            this.renderCart();
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
        toast.className = 'fixed bottom-8 right-8 bg-brand-dark text-white px-6 py-3 rounded-md shadow-2xl z-[100] transition-all transform translate-y-20';
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
            container.innerHTML = '<div class="text-center py-20 text-gray-500 font-serif text-xl">Your cart is empty.</div>';
            document.getElementById('cartSummary').classList.add('hidden');
            return;
        }

        document.getElementById('cartSummary').classList.remove('hidden');
        container.innerHTML = this.items.map(item => {
            const currentSize = item.size || 'Standard Size';
            // Escape for JS string and HTML attribute
            const jsSafeSize = currentSize.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const htmlSafeSize = jsSafeSize.replace(/"/g, '&quot;');

            return `
            <div class="flex items-center gap-6 py-6 border-b border-brand-champagne/30">
                <div class="w-24 h-24 bg-white rounded overflow-hidden flex-shrink-0">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <h3 class="font-serif text-lg">${item.name}</h3>
                    <p class="text-xs text-brand-gold uppercase tracking-widest">${currentSize}</p>
                </div>
                <div class="flex items-center border border-gray-200 rounded">
                    <button onclick="Cart.updateQuantity('${item.id}', '${htmlSafeSize}', -1)" class="w-8 h-8 hover:text-brand-rose">-</button>
                    <span class="w-8 text-center text-sm">${item.quantity}</span>
                    <button onclick="Cart.updateQuantity('${item.id}', '${htmlSafeSize}', 1)" class="w-8 h-8 hover:text-brand-rose">+</button>
                </div>
                <div class="w-24 text-right font-serif">
                    $${(item.price * item.quantity).toLocaleString()}
                </div>
                <button onclick="Cart.removeItem('${item.id}', '${htmlSafeSize}')" class="text-gray-400 hover:text-red-500 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        `;
        }).join('');

        const total = this.getTotal();
        const formattedTotal = `$${total.toLocaleString()}`;

        ['subtotal', 'finalTotal', 'summarySubtotal', 'summaryTotal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = formattedTotal;
        });
    },

    findItem(id, size) {
        return this.items.find(item =>
            item.id === id && (item.size === size || (!item.size && !size) || (item.size === 'Standard Size' && !size) || (!item.size && size === 'Standard Size'))
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();

    // Global Preloader Handler
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
            }, 600); // Slight delay for the "Quiet Luxury" feel
        });
    }
});
window.Cart = Cart;
