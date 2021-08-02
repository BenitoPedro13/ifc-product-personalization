# Personalização de produto
## Setup
- Faça upload do arquivo `dist/ifc-product-personalization-{version}.min.js` substituindo version pela versão deste módulo
- A chamada deste arquivo disponibilizará a classe `window.infracommerce.ProductPersonalization` que deve ser instanciada como no exemplo abaixo:
```
const $productPersonalization = new window.infracommerce.ProductPersonalization({
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
```


Obs.: Para estilização dos elementos deste módulo use como exemplo o arquivo `src/styles/main.scss`

