export const mismatch = (value1, value2) => {
    if(typeof value1 === 'string' && typeof value2 === 'string'){
        return value1 !== value2;
    }
    
    return true;
};