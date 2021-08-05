import ProductPersonalization from './productPersonalization';
import '../styles/main.scss'

if (!window.infracommerce) {
    window.infracommerce = {};
}
window.infracommerce.productPersonalization = ProductPersonalization;