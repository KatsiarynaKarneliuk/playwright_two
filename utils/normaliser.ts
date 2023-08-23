export function normalizeString(str) {
    const replacements = {
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    'ó': 'o',
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
    'Ą': 'A',
    'Ć': 'C',
    'Ę': 'E',
    'Ł': 'L',
    'Ń': 'N',
    'Ó': 'O',
    'Ś': 'S',
    'Ź': 'Z',
    'Ż': 'Z',
    };
    let normalized = str;
    for (let [original, replacement] of Object.entries(replacements)) {
        normalized = normalized.replace(new RegExp(original, 'g'), replacement);
    }
    normalized = normalized.replace(/\s+/g, '_');
    return normalized;
}
