import './styles/main.css';
import { initHero3D } from './js/hero.js';
import { Cart, filterProducts } from './js/shop.js';

document.addEventListener('DOMContentLoaded', () => {
    // Reveal all elements marked with .reveal
    const revealAll = () => {
        document.querySelectorAll('.reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('reveal-visible'), i * 100);
        });
    };

    // Initialize 3D Hero
    if (document.getElementById('hero-canvas-container')) {
        initHero3D();
    }

    // Initialize Shop Logic
    Cart.updateBadge();
    if (document.getElementById('cartItems')) Cart.renderCart();
    if (document.getElementById('orderItems')) Cart.renderOrderSummary();

    // Default Filter for Catalogue
    if (document.querySelector('.product-card')) {
        filterProducts('all');
    }

    // Smooth reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // Mobile Menu Logic
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            // Animate hamburger to X (optional polish)
            menuToggle.querySelectorAll('div').forEach((line, i) => {
                if (mobileMenu.classList.contains('active')) {
                    if (i === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (i === 1) line.style.opacity = '0';
                    if (i === 2) line.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                }
            });
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.querySelectorAll('div').forEach(line => {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                });
            });
        });
    }
});

// Update Reveal styles in main.css via JS injection or class update
const style = document.createElement('style');
style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1); }
    .reveal-visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
