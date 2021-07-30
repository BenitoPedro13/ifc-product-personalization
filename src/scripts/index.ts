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
                'Máximo {max-length} caracteres'
            ]
        },
        {
            title: 'Escolha a tipografia',
            name: 'tipografia',
            type: 'radio-button',
            options: [
                $('<span class="pnz-snellroundhand" data-value="snell-roundhand" data-checked="true">Snell Roundhand</span>'),
                $('<span class="pnz-snellroundhand-bold" data-value="snell-roundhand-bold">Snell Roundhand</span>'),
                $('<span class="pnz-snellroundhand-black" data-value="snell-roundhand-black">Snell Roundhand</span>')
            ],
            callback: (value, textElement) => {
                switch (value) {
                    case "snell-roundhand":
                        $(textElement).css('font-family', '"Snell Roundhand", sans-serif');
                        break;
                    case "snell-roundhand-black":
                        $(textElement).css('font-family', '"Snell Roundhand-Black", sans-serif');
                        break;
                    case "snell-roundhand-bold":
                        $(textElement).css('font-family', '"Snell Roundhand-Bold", sans-serif');
                        break;
                }
            }
        },
        {
            title: 'Escreva a sua gravação',
            type: 'text-to-personalization',
            options: ['Escreva aqui']
        }
    ]
});
$productPersonalization.init();