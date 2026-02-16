import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                catalogue: resolve(__dirname, 'catalogue.html'),
                product: resolve(__dirname, 'product-details.html'),
                cart: resolve(__dirname, 'cart.html'),
                checkout: resolve(__dirname, 'checkout.html'),
                orderStatus: resolve(__dirname, 'order-status.html'),
                collection: resolve(__dirname, 'collection.html'),
                about: resolve(__dirname, 'about.html'),
                confirmation: resolve(__dirname, 'order-confirmation.html')
            }
        }
    }
});
