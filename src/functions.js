export function convertToUnsignedInt(number) {
    return convertToInt(number, 0);
}

export function convertToPositiveInt(number) {
    return convertToInt(number, 1);
}

export function convertToPositiveIntOrDefault(number, defaultValue) {
    return convertToInt(number, 1, defaultValue);
}

function convertToInt(number, min, defaultValue) {
    number = parseInt(number);

    return number > min ? number : (defaultValue ? defaultValue : min);
}

export function getStringOrDefault(string, defaultValue) {
    return string
        ? convertToString(string)
        : (defaultValue ? convertToString(defaultValue) : '')
}

export function convertToBoolean(value) {
    return value === true;
}

export function convertToString(value) {
    return value ? `${value}` : '';
}