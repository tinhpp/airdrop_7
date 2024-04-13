export const formatNumber = (value, digits = 2) => {
    return Math.floor(value * (10 ** digits)) / (10 ** digits);
}