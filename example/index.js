import './styles/main.scss';

const pnzToast = (text, time) => {
    let $toast = $(`<div class="personalization-toast-popup">${text}</div>`);
    $toast.appendTo('body');
    $toast.addClass('active');
    setTimeout(() => {
        $toast.removeClass('active');
        setTimeout(() => {$toast.remove()}, 1000);
    }, time ?? 5000);
}
const fnInitPersonalization = async function($, ProductPersonalization) {
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
            beforeAddToCart: ($textElement, productDetails) => {
                let text = $textElement.text();
                if (text.length == 0) {
                    pnzToast('Escreva um texto para a gravação!');
                    return false;
                }
                let $options = $textElement.closest('.pnz-modal-dialog').find('.pnz-modal-options');
                let personalizationBlockwords = JSON.parse(sessionStorage.getItem('personalizationBlockwords')) ?? null;
                if (personalizationBlockwords) {
                    let wordsBlockeds = personalizationBlockwords.filter(word => {
                        return text.split(' ').includes(word);
                    });
                    if (wordsBlockeds.length > 0) {
                        $options.find('#pnz-text-to-personalization input').val('').trigger('keyup');
                        pnzToast('Este conteúdo é impróprio, por favor, reescreva a mensagem!');
                        return false;
                    }
                }
                $options.append(`<input type="hidden" name="posicao" value="${productDetails['personalize-text-photo-position']}">`);
                return true;
            }
        }
    });
    $productPersonalization.init();
    if (!sessionStorage.getItem('personalizationBlockwords')) {
        const options = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vtex.ds.v10+json',
            'REST-Range': 'resources=0-3000'
            }
        };
        let personalizationBlockwords = await fetch('/api/dataentities/BW/search?_fields=blockword', options)
        .then(response => response.json().then(response => response.map(data => data.blockword)))
        .catch(err => []);
        sessionStorage.setItem('personalizationBlockwords', JSON.stringify(personalizationBlockwords));
    }
    switch ($('#___rc-p-id').val()) {
        case '28':
            $('body').append('<style>.pnz-text-content{top: 84%!important}</style>');
            break;
        case '7141718':
            $('body').append('<style>.pnz-text-content{top: 61%!important}</style>');
            break;
        case '32':
            $('body').append('<style>.pnz-text-content{top: 40%!important}</style>');
            break;
    }
    $(document).on('click', '#btn-personalization-add-to-cart', () => {
        if (!$('#pnz-terms-personalization').prop('checked')) {
            pnzToast('Por favor, aceite os termos para prosseguir!');
        }
    });
}

if (!window.jQuery || !window.infracommerce.productPersonalization) {
    document.addEventListener('DOMContentLoaded', async function() {
        fnInitPersonalization(window.jQuery, window.infracommerce.productPersonalization);
    });
} else {
    fnInitPersonalization(window.jQuery, window.infracommerce.productPersonalization);
}