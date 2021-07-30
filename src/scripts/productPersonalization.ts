import { addToCart } from './helpers/cart';
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

interface IObeservers {
    beforeAddToCart?(textElement: JQuery<HTMLElement>): void,
    afterAddToCart?(): void
}

interface IProps {
    options: IOptions[]
    btnShowModal?: IButton
    terms?: string
    observers?: IObeservers
}

export default class ProductPersonalization {
    options: IOptions[];
    product: any;
    btnShowModal: IButton;
    terms: string;
    observers: IObeservers;
    modalId = 'personalizationProductModal';
    buttonShowModalId = 'btn-product-personalization';
    $modal: JQuery<HTMLElement>;
    $textPersonalization: JQuery<HTMLElement>;
    textMaxLength: number;
    
    constructor(props: IProps) {
        const { options, btnShowModal, terms, observers } = props;
        this.options = options;
        this.btnShowModal = btnShowModal;
        this.terms = terms ?? 'Assinale para prosseguir, ciente que produtos Pernod personalizados não podem ser devolvidos para troca ou reembolso.';
        this.observers = observers ?? null;
    }

    init() {
        document.addEventListener("DOMContentLoaded", async (event) => {
            this.product = await this.getProductDetails();
            if (!this.product.length) {
                return;
            } else if ((this.product['personalize-text-photo-status'] && this.product['personalize-text-photo-status'][0] !== "Sim")) {
                return;
            }
            this.product = this.product[0];
            this.textMaxLength = this.product['personalize-text-photo-length'] ? this.product['personalize-text-photo-length'][0] : 15
            this.createModal();
            this.createButtonShowModal();
            this.events();
        })
    }

    private createButtonShowModal() {
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

    private createModal() {
        let img = this.product['personalize-text-photo-url'][0];
        img = img ? '/arquivos/'+img : (this.product?.items[0]?.images ?? []);
        const productImg = this.product?.items[0]?.images[0]?.imageUrl ?? '';
        const options = this.getOptionsElements();
        const $modal = $(`
        <div id="${this.modalId}" class="pnz-modal" tabindex="-1">
            <div class="pnz-modal-dialog">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar">&times;</button>
                <div class="pnz-modal-content">
                    <div class="pnz-modal-personalization-details">
                        <div class="pnz-modal-options"></div>
                        <div class="pnz-modal-preview">
                            <div style="background-image: url(${img})">
                                <span class="pnz-text-content"></span>
                            </div>
                            <p>Imagem meramente ilustrativa.</p>
                        </div>
                    </div>
                    <div class="pnz-modal-product">
                        <div class="pnz-modal-title">Produto selecionado</div>
                        <div class="pnz-modal-product-details">
                            <div class="pnz-product-image">
                                <img src="${productImg}" alt="${this.product?.productTitle ?? 'Pernod'}">
                            </div>
                            <div class="pnz-product-information">
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
                            <div class="pnz-product-add-to-cart">
                                <div id="btn-personalization-add-to-cart" class="btn btn--purple pnz-btn-disabled">Finalizar pedido</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
        this.$textPersonalization = $modal.find('.pnz-modal-preview .pnz-text-content');
        $modal.find('.pnz-modal-options').append(options);
        let $textPreview = $modal.find('.pnz-text-content');
        let colorDefault = this.product['personalize-text-photo-color'];
        if (colorDefault.length>0) {
            $textPreview.css('color', colorDefault[0]);
        }
        let textPosition = this.product['personalize-text-photo-position'];
        if (textPosition.length>0) {
            textPosition = textPosition[0].toLowerCase();
            switch (textPosition) {
                case 'baixo':
                    $textPreview.css('top', 'calc(50% - 10px)');
                    break;
            }
        }
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

    private events() {
        type IEvent = "show" | "hide";
        $.each(['show', 'hide'], function (i, ev: IEvent) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
              this.trigger(ev);
              return el.apply(this, arguments);
            };
        });

        $(document).on('keyup', (event) => {
            if(event.key === "Escape") {
                this.$modal.hide();
            }
        });

        this.$modal.on('click', '.btn-close', () => {
            this.$modal.hide();
        });

        $(document).on('click', '#btn-personalization-add-to-cart', async () => {
            if ($('#btn-personalization-add-to-cart').hasClass('pnz-btn-disabled')) {
                return;
            }
            await this.submitPersonalization();
        });

        $(document).on('click', '#pnz-terms-personalization', function () {
            if ($(this).prop('checked')) {
                $('#btn-personalization-add-to-cart').removeClass('pnz-btn-disabled');
            } else {
                $('#btn-personalization-add-to-cart').addClass('pnz-btn-disabled');
            }
        })
    }

    private async submitPersonalization() {
        if (!(this.product?.items.length > 0)) {
            $('#btn-personalization-add-to-cart').text('Item indisponível').css('cursor', 'default').css('opacity', '.7');
            return;
        }
        if (this.observers?.beforeAddToCart) {
            this.observers?.beforeAddToCart(this.$textPersonalization);
        }
        let attachments = [{
            name: "gravacao",
            content: {
                "gravacao": this.$textPersonalization.text(),
                "lateralidade": this.$modal.find('[name="lateralidade"]').val() ?? "destro",
                "posicao": this.$modal.find('[name="posicao"]').val() ?? "garrafa",
                "tipografia": this.$modal.find('[name="tipografia"]').val() ?? "SCRIPT 412 1 LINHA"
            }
        }]
        let itemId = this.product?.items[0]?.itemId;
        let sellerId = this.product?.items[0]?.sellers[0]?.sellerId ?? 1;
        let isAdded = await addToCart(itemId, 1, sellerId, attachments);
        if (isAdded) {
            this.$modal.hide();
            $(".minicart").toggleClass("minicart--open");
            $(".overlay-minicart").toggleClass("overlay-minicart--open");
        }
        if (this.observers?.afterAddToCart) {
            this.observers?.afterAddToCart();
        }
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

        const getTextPreviewElement = ($modal: JQuery) => {
            return $modal.find('.pnz-modal-preview .pnz-text-content');
        }
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
                        return $(`<input type="text" name="${name}" placeholder="${title}" maxlength="${this.textMaxLength}"/><span id="pnz-text-to-personalization-btn"></span>`);
                    });
                    $($parentOptionType).on('keyup', 'input', function() {
                        let text = $(this).val().toString();
                        $('.pnz-text-content').text(text);
                        option.callback(text, getTextPreviewElement($(this).closest('.pnz-modal')));
                    });
                    $('#pnz-text-to-personalization-btn').on('click', function() {
                        let text = $($parentOptionType).val().toString();
                        $('.pnz-text-content').text(text);
                        option.callback(text, getTextPreviewElement($(this).closest('.pnz-modal')));
                    });
                    break;
                case 'radio-button':
                    $parentOptionType = fnAddOption($(`<ul class="pnz-radio-button"></ul>`), option, (value, title, key, checked) => {
                        return $(`<li><input type="radio" id="${name}-${key}" name="${name}" value="${value}" ${checked}/><label for="${name}-${key}">${title}</label></li>`);
                    });
                    $parentOptionType.on('change', 'input[type="radio"]', function() {
                        option.callback($(this).val().toString(), getTextPreviewElement($(this).closest('.pnz-modal')));
                    });
                    break;
                case 'select':
                    $parentOptionType = fnAddOption($(`<select class="pnz-select" name="${name}"></select>`), option, (value, title) => {
                        return $(`<option value="${value}">${title}</option>`);
                    });
                    $parentOptionType.on('change', function() {
                        option.callback($(this).val().toString(), getTextPreviewElement($(this).closest('.pnz-modal')));
                    });
                    break;
                case 'checkbox':
                    $parentOptionType = fnAddOption($(`<ul class="pnz-checkbox"></ul>`), option, (value, title, key, checked) => {
                        return $(`<li><input type="checkbox" name="${name}[${value}]" value="yes" ${checked}>${title}</option></li>`);
                    });
                    $parentOptionType.on('change', 'input[type="checkbox"]', function() {
                        option.callback($(this).is('checked') ? 'yes' : 'no', getTextPreviewElement($(this).closest('.pnz-modal')));
                    });
                    break;
                case 'information':
                    $parentOptionType = fnAddOption($(`<div class="pnz-information"></div>`), option, (value, title) => {
                        return $((`<p>${title}</p>`).replace('{max-length}', `${this.textMaxLength}`));
                    })
                    break;
            }
            $optionParent.addClass(name);
            $optionParent.append($parentOptionType);
            $optionsHTML.append($optionParent);
        });
        return $optionsHTML;
    }
}