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
                '<strong>Texto somente da parte frontal da garrafa (acima ou abaixo do rótulo)</strong>',
                'Máximo XX caracteres'
            ]
        },
        {
            title: 'Escolha a tipografia',
            type: 'radio-button',
            options: [
                $('<span class="pnz-snellroundhand" data-value="snell-roundhand" data-checked="true">Snell Roundhand</span>')
            ]
        },
        {
            title: 'Escreva a sua gravação',
            type: 'text-to-personalization',
            options: ['Escreva aqui']
        }
    ]
});
$productPersonalization.init();