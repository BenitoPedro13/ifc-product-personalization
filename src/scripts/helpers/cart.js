// "attachments": [{
//     "name": "Personalização",
//     "content": {
//         "Nome": "Infracommrce"
//     }
// }]

export async function addToCart(id, quantity, seller, attachments) {
    let index = getItemIndex(id);
    let res;
    if (index !== false) {
        res = await vtexjs.checkout.cloneItem(index, [{ itemAttachments: attachments, quantity: quantity }])
            .fail(data => false);
    } else {
        res = await vtexjs.checkout.addToCart([{ id, quantity, seller }], null, 1);
        if (res && attachments) {
            index = getItemIndex(id, res);
            await itemAddAttachments(index, attachments);
        }
    }
    return res !== false;
}

export async function itemAddAttachments(index, attachments) {
    if (index !== false) {
        let attachmentOfferingsNames = vtexjs.checkout.orderForm.items[index].attachmentOfferings.map(att => att.name);
        await attachments.map(async attachment => {
            if (attachmentOfferingsNames.includes(attachment.name)) {
                await vtexjs.checkout.addItemAttachment(index, attachment.name, attachment.content, null, false);
            }
        });
        return true;
    }
    return false;
}

export function getItemIndex(id, orderForm = null) {
    if (!orderForm) {
        orderForm = vtexjs.checkout.orderForm;
    }
    for (const [index, item] of orderForm.items.entries()) {
        if (item.id == id) {
            return index;
        }
    }
    return false;
}