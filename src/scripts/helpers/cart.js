// "attachments": [{
//     "name": "Personalização",
//     "content": {
//         "Nome": "Infracommrce"
//     }
// }]

export async function addToCart(id, quantity, seller, attachments) {
    let index = getItemIndex(id);
    let res;
    if (index) {
        res = await vtexjs.checkout.cloneItem(index, [{ itemAttachments: attachments, quantity }]);
    } else {
        res = await vtexjs.checkout.addToCart([{ id, quantity, seller }], null, 1);
        if (attachments) {
            await itemAddAttachments(id, attachments);
        }

    }
    if (res?.messages?.length) {
        return false;
    }
    return true;
}

export async function itemAddAttachments(id, attachments) {
    let index = getItemIndex(id);
    if (index) {
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

export function getItemIndex(id) {
    for (const [index, item] of vtexjs.checkout.orderForm.items.entries()) {
        if (item.id == id) {
            return index;
        }
    }
}