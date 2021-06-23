export const short = value => {
    if (typeof value === 'string') return value.length < 6;
    return true;
};