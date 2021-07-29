import ProductPersonalization from './productPersonalization';
import '../styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
    let style = document.createElement('link');
    style.setAttribute('href', '/arquivos/pnz-main.min.css');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', 'text/css');
    document.getElementsByTagName('head')[0].appendChild(style);
});

const $productPersonalization = new ProductPersonalization({
    btnShowModal: {
        text: 'Personalize',
        localeRef: '.buy-button-ref',
        locale: 'before',
    },
    options: [
        {
            title: 'Posição na garrafa',
            type: 'information',
            options: [
                'Texto somente da parte frontal da garrafa (acima ou abaixo do rótulo)',
                '<span class="description">Máximo XX caracteres</span>'
            ]
        },
        {
            title: 'Escolha a tipografia',
            type: 'radio-button',
            options: [
                $('<span data-value="snell-roundhand">J. F. Winter</span>'),
                $('<span data-value="times">J. F. Winter</span>'),
                $('<span data-value="touchew03-medium">J. F. Winter</span>')
            ]
        }
    ]
});
$productPersonalization.init();