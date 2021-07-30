import { slugify } from './helpers/str';

type Type = "text-to-personalization" | "radio-button" | "select" | "checkbox" | "information"
type Locale = "after" | "before" | "innerHeader" | "innerFooter"

interface IOptions {
    title: string
    name?: string
    type: Type
    options: string[] | JQuery<HTMLElement>[]
    callback?(value: string, textElement: JQuery<HTMLElement>): void
}

interface IButton {
    text?: string
    localeRef?: string
    locale?: Locale
    class?: string[]
}

interface IProps {
    options: IOptions[]
    btnShowModal?: IButton
    terms?: string
}

export default class ProductPersonalization {
    options: IOptions[];
    product: any;
    btnShowModal: IButton;
    terms: string;
    modalId = 'personalizationProductModal';
    buttonShowModalId = 'btn-product-personalization';
    $modal: JQuery<HTMLElement>;
    $textPersonalization: JQuery<HTMLElement>;
    
    constructor(props: IProps) {
        const { options, btnShowModal, terms } = props;
        this.options = options;
        this.btnShowModal = btnShowModal;
        this.terms = terms ?? 'Assinale para prosseguir, ciente que produtos Pernod personalizados não podem ser devolvidos para troca ou reembolso.';
    }

    init() {
        document.addEventListener("DOMContentLoaded", async (event) => {
            this.product = await this.getProductDetails();
            if (!this.product.length) {
                return;
            }
            this.product = this.product[0];
            this.createModal();
            this.createButtonShowModal();
            this.events();
        })
    }

    createButtonShowModal() {
        const $button = $(`<div id="${this.buttonShowModalId}">${this.btnShowModal?.text ?? 'Personalize'}</div>`);
        $button.on('click', () => {
            this.$modal.show(300);
        })
        let $localeRef = $(this.btnShowModal?.localeRef ?? '.buy-button');
        switch (this.btnShowModal?.locale) {
            case 'after':
                $localeRef.insertAfter($button);
                break;
            case 'before':
                $button.insertBefore($localeRef);
                break;
            case 'innerHeader':
                $localeRef.prepend($button);
                break;
            case 'innerFooter':
                $localeRef.append($button);
                break;
            default:
                $button.insertBefore($localeRef);
        }
    }

    createModal() {
        const img = this.product?.items[0]?.images ?? [];
        const imgSrc = img.length>0 ? (img[0]?.imageUrl ?? '') : '';
        const options = this.getOptionsElements();
        const $modal = $(`
        <div id="${this.modalId}" class="pnz-modal" tabindex="-1">
            <div class="pnz-modal-dialog">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar">&times;</button>
                <div class="pnz-modal-content">
                    <div class="pnz-modal-personalization-details">
                        <div class="pnz-modal-options"></div>
                        <div class="pnz-modal-preview">
                            <div style="background-image: url(${imgSrc})">
                                <span class="pnz-text-content"></span>
                            </div>
                            <p>Imagem meramente ilustrativa.</p>
                        </div>
                    </div>
                    <div class="pnz-modal-product">
                        <div class="pnz-modal-title">Produto selecionado</div>
                        <div class="pnz-modal-product-details">
                            <div class="col-md-3">
                                <img src="${imgSrc}" alt="${this.product?.productTitle ?? 'Pernod'}">
                            </div>
                            <div class="col-md-6">
                                <div class="pnz-product-header">
                                    <div id="pnz-product-title">${this.product?.productTitle ?? ''}</div>
                                    <div id="pnz-product-cod">COD.${this.product?.productReference ?? ''}</div>
                                </div>
                                <div class="pnz-product-personalization-description">
                                    <p>Personalizado com o nome:</p>
                                    <p class="pnz-text-content">-</p>
                                </div>
                                <div class="pnz-product-footer">
                                    <div class="pnz-terms">
                                        <input type="checkbox" id="pnz-terms-personalization">
                                        <label for="pnz-terms-personalization">
                                            ${this.terms}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div id="btn-personalization-add-to-cart" class="btn btn--purple">Finalizar pedido</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
        $modal.find('.pnz-modal-options').append(options);
        const $modalBack = $(`<div class="pnz-modal-backdrop"></div>`);
        $modal.on('show', (event) => {
            event.preventDefault();
            $modal.css('display', 'flex');
            $modalBack.appendTo('body');
            $modalBack.show(300);
            $modalBack.css('opcity', .5);
            $modal.css('opacity', 1);
        });
        $modal.on('hide', (event) => {
            $modal.css('display', 'none');
            $modalBack.hide(300, () => {
                $modalBack.remove();
            });
        });
        $modal.appendTo('body');
        this.$modal = $modal;
    }

    events() {
        type IEvent = "show" | "hide";
        $.each(['show', 'hide'], function (i, ev: IEvent) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
              this.trigger(ev);
              return el.apply(this, arguments);
            };
        });
	    
        $(document).on('click', '#btn-personalization-add-to-cart', () => {
            console.log('finalizar');
        });

        $(document).on('keyup', (event) => {
            if(event.key === "Escape") {
                this.$modal.hide();
            }
        });

        this.$modal.on('click', '.btn-close', () => {
            this.$modal.hide();
        })
    }

    async getProductDetails() {
        const productId = $('#___rc-p-id').val() ?? null;
        if (!productId) {
            return null;
        }
        const query = `?fq=productId:${productId}`;
        return await fetch(`/api/catalog_system/pub/products/search${query}`)
            .then(data => 
                data.json()
                    .then(json => json)
                    .catch(err => null)
            )
            .catch(err => null);
    }

    getOptionsElements() {
        let $optionsHTML = $('<div></div>');

        const fnAddOption = (
            element: JQuery<HTMLElement>,
            option: IOptions,
            call:(value: string,title: string | JQuery<HTMLElement>, key?: number, checked?: string) => JQuery<HTMLElement>
        ): JQuery<HTMLElement> => {
            option.options.map((opt, key) => {
                let value = typeof opt === 'object' ? opt.attr('data-value') : opt;
                let checked = typeof opt === 'object' && opt.attr('data-checked')=='true' ? 'checked' : '';
                opt = typeof opt === 'object' ? opt.html() : opt;
                let $button = call(value,opt,key,checked);
                element.append($button);
            });
            return element;
        }
        let $textPersonalization = this.$textPersonalization;
        let $parentOptionType: JQuery;
        this.options.map((option) => {
            if (!option.callback) {
                option.callback = () => {};
            }
            let $optionParent = $('<div></div>');
            $optionParent.append($(`<div class="pnz-modal-option-title">${option.title}</div>`));
            let name = option.name ?? slugify(option.title) ?? '';
            switch (option.type) {
                case 'text-to-personalization':
                    if ($optionsHTML.find('input#pnz-text-to-personalization').length>0) {
                        return;
                    }
                    $parentOptionType = fnAddOption($(`<div id="pnz-text-to-personalization"></div>`), option, (value, title) => {
                        return $(`<input type="text" name="${name}" placeholder="${title}"/><span id="pnz-text-to-personalization-btn"></span>`);
                    });
                    console.log($parentOptionType);
                    $($parentOptionType).on('keyup', 'input', function() {
                        let text = $(this).val().toString();
                        console.log(text);
                        $('.pnz-text-content').text(text);
                        option.callback(text, $textPersonalization);
                    });
                    break;
                case 'radio-button':
                    $parentOptionType = fnAddOption($(`<ul class="pnz-radio-button"></ul>`), option, (value, title, key, checked) => {
                        return $(`<li><input type="radio" id="${name}-${key}" name="${name}" value="${value}" ${checked}/><label for="${name}-${key}">${title}</label></li>`);
                    });
                    $parentOptionType.on('change', 'input[type="radio"]', function() {
                        option.callback($(this).val().toString(), $textPersonalization);
                    });
                    break;
                case 'select':
                    $parentOptionType = fnAddOption($(`<select class="pnz-select" name="${name}"></select>`), option, (value, title) => {
                        return $(`<option value="${value}">${title}</option>`);
                    });
                    $parentOptionType.on('change', function() {
                        option.callback($(this).val().toString(), $textPersonalization);
                    });
                    break;
                case 'checkbox':
                    $parentOptionType = fnAddOption($(`<ul class="pnz-checkbox"></ul>`), option, (value, title, key, checked) => {
                        return $(`<li><input type="checkbox" name="${name}[${value}]" value="yes" ${checked}>${title}</option></li>`);
                    });
                    $parentOptionType.on('change', 'input[type="checkbox"]', function() {
                        option.callback($(this).is('checked') ? 'yes' : 'no', $textPersonalization);
                    });
                    break;
                case 'information':
                    $parentOptionType = fnAddOption($(`<div class="pnz-information"></div>`), option, (value, title) => {
                        return $(`<p>${title}</p>`);
                    })
                    break;
            }
            $optionParent.append($parentOptionType);
            $optionsHTML.append($optionParent);
        });
        return $optionsHTML;
    }
}