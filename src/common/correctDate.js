export const minStartDay = () => {
    var minStartDay = new Date();
    var dd = String(minStartDay.getDate()).padStart(2, '0');
    var mm = String(minStartDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = minStartDay.getFullYear();

    minStartDay = yyyy + '-' + mm + '-' + dd ;
    return minStartDay;
};

export const maxStartDay = () => {
    var maxStartDay = new Date();
    var dd = String(maxStartDay.getDate()).padStart(2, '0');
    var mm = String(maxStartDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = maxStartDay.getFullYear() + 1;
    
    maxStartDay = yyyy + '-' + mm + '-' + dd ;
    return maxStartDay;
};

export const dateIsCorrect = value => {
    return !(value >= minStartDay() && value <= maxStartDay());
}



