const fnInitPersonalization = function($, ProductPersonalization) {
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
                callback: function(value, textElement) {
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
        ],
        observers: {
            beforeAddToCart: function($textElement, productDetails) {
                $textElement.closest('.pnz-modal-dialog').find('.pnz-modal-options').append(`
                    <input type="hidden" name="posicao" value="${productDetails['personalize-text-photo-position']}">
                `);
            }
        }
    });
    $productPersonalization.init();
    if ($('#___rc-p-id').val() === "28") {
        $('body').append('<style>.pnz-text-content{top: 84%!important}</style>');
    }
}
if (!window.jQuery || !window.infracommerce.productPersonalization) {
    document.addEventListener('DOMContentLoaded', function() {
        fnInitPersonalization(window.jQuery, window.infracommerce.productPersonalization);
    });
} else {
    fnInitPersonalization(window.jQuery, window.infracommerce.productPersonalization);
}