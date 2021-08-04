export function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

export function capitalizeWords(text: string) {
    if (text.length == 0) {
        return '';
    }
    return text.split(' ').map(word => {
        let firstLetter = word.charAt(0);
        word = word.toLowerCase();
        if (/^[A-Z]*$/.test(firstLetter)) {
            word = word[0].toUpperCase() + word.substr(1);
        }
        return word;
    }).join(' ');
}