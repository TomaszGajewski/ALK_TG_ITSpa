import $ from 'jquery';
import {loadCart, addToCart, clearCart} from '../cart/cartAdapter';
import {dateIsCorrect, maxStartDay, minStartDay} from '../common/correctDate';
import {required} from '../common/required';

export const cartSummary = (showFull = false) =>{
    const fragment = $(document.createDocumentFragment());

    var summaryValue = 0;

    const h2 = $('<h2>Koszyk</h2>');
    const section = $('<section></section>');

    fragment.append(h2, section);

    const cart = loadCart();

    if(cart == null)
    {
        fragment.append("Koszyk jest pusty");
        return fragment;
    }

    var minDay = minStartDay();
    var maxDay = maxStartDay();

    const datepicker = $(`
    <form name="reservation" autocomplete="off" novalidate>
        <div class="form-group">
            <label for="startDate">Data początkowa</label>
            <input type="date" id="startDate"
                name="startDate" 
                min="${minDay}" max="${maxDay}">
            <p id="start-date-required" class="text-danger">start date is required</p>
            <p id="start-date-correct" class="text-danger">start date must be earlier then end date</p>
            <label for="endDate"> Data końcowa</label>
            <input type="date" id="endDate"
                name="endDate" 
                min="${minDay}" max="${maxDay}">
            <p id="end-date-required" class="text-danger">end date is required</p>
            <p id="end-date-correct" class="text-danger">end date must be later then start date</p>
            <p id="start-less-then-end-date" class="text-danger">The start date must be less then end date</p>
        </div>`
       );

    const validate = (validation, errorMessage) => {
    validation ? errorMessage.show() : errorMessage.hide();
    }

    const errorMessages = {
        startDate: {
            required: datepicker.find('#start-date-required'),
            correct: datepicker.find('#start-date-correct')
        },
        endDate: {
            required: datepicker.find('#end-date-required'),
            correct: datepicker.find('#end-date-correct')
        },
        fullDate:{
            correct: datepicker.find('#start-less-then-end-date')
        }     
    };

    errorMessages.startDate.required.hide();
    errorMessages.startDate.correct.hide();
    errorMessages.endDate.required.hide();
    errorMessages.endDate.correct.hide();
    errorMessages.fullDate.correct.hide();

    const startDate = datepicker.find('#startDate');
    const endDate = datepicker.find('#endDate');

    startDate.val(cart.startDate);
    endDate.val(cart.endDate);

    startDate.on('change', event =>{
        dateIsCorrect(startDate.val());
    });
    endDate.on('change', event =>{
        dateIsCorrect(endDate.val());
    });

    section.empty().append(datepicker);

    if(!showFull)
    {
        var dates = `
        <h4>Data początkowa - <strong>${cart.startDate}</strong> Data końcowa - <strong>${cart.endDate}</strong></h4>`;
        section.empty().append(dates);
    }

    var articles = $(`<h4>Pokoje:</h4>`);

    section.append(articles);

    const articleRooms = cart.rooms.map(room =>{
        const article = $( `<div class="mb-3 row"><div class="col-sm-6"><p><strong>Nazwa</strong> ${room.name} | <strong>Cena</strong> ${room.price.toFixed(2)} | <strong>Ilość</strong> ${room.quantity}</p></div>
        <div class="col-sm-1 buttonDiv"><button type="button" class="form-control" id="buttonInc">+</button></div><div class="col-sm-1 buttonDiv"><button type="button" class="form-control" id="buttonDec">-</button></div></div>`);

        const addToCartButton = article.find('#buttonInc');
        const removeFromCartButton = article.find('#buttonDec');

        addToCartButton.on('click', () =>{
            addToCart("rooms",room,1);
            document.dispatchEvent(new CustomEvent('navigation',{
                detail: {
                    view: 'cartSummary'
                }}));
                }); 

        removeFromCartButton.on('click', () =>{
            addToCart("rooms",room,-1);
            document.dispatchEvent(new CustomEvent('navigation',{
                detail: {
                    view: 'cartSummary'
                }}));
                }); 
            
        summaryValue += room.price * room.quantity;
        return article;
    })
    
    section.append(articleRooms);

    articles = $(`<h4>Usługi</h4>`);

    section.append(articles);

    const articleTreatments = cart.treatments.map(treatment =>{
        const article = $( `<div class="mb-3 row"><div class="col-sm-6"><p><strong>Nazwa</strong> ${treatment.name} | <strong>Cena</strong> ${treatment.price.toFixed(2)} | <strong>Ilość</strong> ${treatment.quantity}</p></div>
        <div class="col-sm-1 buttonDiv"><button type="button" class="form-control" id="buttonInc">+</button></div><div class="col-sm-1 buttonDiv"><button type="button" class="form-control" id="buttonDec">-</button></div></div>`);

        const addToCartButton = article.find('#buttonInc');
        const removeFromCartButton = article.find('#buttonDec');


        addToCartButton.on('click', () =>{
            addToCart("treatments",treatment,1);
            document.dispatchEvent(new CustomEvent('navigation',{
                detail: {
                    view: 'cartSummary'
                }}));
                }); 

        removeFromCartButton.on('click', () =>{
            addToCart("treatments",treatment,-1);
            document.dispatchEvent(new CustomEvent('navigation',{
                detail: {
                    view: 'cartSummary'
                }}));
                }); 

        summaryValue += treatment.price * treatment.quantity;
        return article;
    })

    section.append(articleTreatments);
    

    var articleSummary = $(`
    <h4>Podsumowanie : <strong>${summaryValue}</strong></h4>`);

    section.append(articleSummary);

    const clearCartButton = $(`<button type="button" class="col-sm-2 buttonDiv">Wyczyść koszyk</button>`);

    clearCartButton.on('click', event =>{
        clearCart();
    });       

    section.append(clearCartButton);

    const saveCartButton = $(`<button type="button" class="col-sm-2 buttonDiv">Zapis</button>`);   

    section.append(saveCartButton);

    saveCartButton.on('click', event =>{

        const isStartDateRequired = required(startDate.val());
        const isStartDateCorrect = dateIsCorrect(startDate.val());
        const isEndDateRequired = required(endDate.val());
        const isEndDateCorrect = dateIsCorrect(endDate.val());
        const isFullDateCorrect = (endDate.val() < startDate.val());

        validate(required(startDate.val()), errorMessages.startDate.required);
        validate(required(endDate.val()), errorMessages.endDate.required);
        validate(dateIsCorrect(startDate.val()), errorMessages.startDate.correct);
        validate(dateIsCorrect(endDate.val()), errorMessages.endDate.correct);
        validate(endDate.val() < startDate.val() ,errorMessages.fullDate.correct);

        if(!isStartDateRequired && !isStartDateCorrect && !isEndDateRequired && !isEndDateCorrect && !isFullDateCorrect)
        {
            addToCart("startDate",startDate.val());
            addToCart("endDate",endDate.val());
            location.reload();
        }
    }); 
    
    if(!showFull)
    {
        fragment.find(".buttonDiv").remove();
    }

    return fragment;
};