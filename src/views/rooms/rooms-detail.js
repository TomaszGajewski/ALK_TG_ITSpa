import $ from 'jquery';
import axios from 'axios';
import { addToCart, loadCart } from '../../cart/cartAdapter';
import {required} from '../../common/required';
import {dateIsCorrect, maxStartDay, minStartDay} from '../../common/correctDate';

export const roomsDetail = roomId => {
    const fragment = $(document.createDocumentFragment());
    const section = $('<section>Loading...</section>');

    const cart = loadCart();

    var minDay = minStartDay();
    var maxDay = maxStartDay();

    const datepicker = $(`
    <form name="reservation" autocomplete="off" novalidate>
        <div class="form-group">
            <label for="startDate">Data początkowa</label>
            <input type="date" id="startDate"
                name="startDate" 
                min="${minDay}" max="${maxDay}">
            <p id="start-date-required" class="text-danger">Data początkowa jest wymagana.</p>
            <p id="start-date-correct" class="text-danger">Data początkowa nie jest poprawna.</p>
            <label for="endDate">endDate</label>
            <input type="date" id="endDate"
                name="endDate" 
                min="${minDay}" max="${maxDay}">
            <p id="end-date-required" class="text-danger">Data końcowa jest wymagana.</p>
            <p id="end-date-correct" class="text-danger">Data końcowa nie jest poprawna.
            <p id="start-less-then-end-date" class="text-danger">Data poczatkowa musi być wcześniejsza niż data końcowa</p>
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

    axios.get(`http://localhost:3000/rooms/${roomId}`)
        .then(response => response.data)
        .then(room => {
            const {id,name, description, beds, guests, price} = room;
 
            const article =$(`
                <article>
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <p><strong>Łóżka</strong> ${beds} | <strong>Goście
                </article>
                <div class="mb-3 row">
                    <label class="col-sm-1 col-form-label "for="quantity">Ilość</label> 
                    <div class="col-sm-1">
                        <input id="quantity" class="form-control" type="number" value="1" min="1" max="5">
                    </div>
                    <div class="col-sm-2">
                        <button type="button" class="form-control">Dodaj do koszyka</button>
                    </div>
                </div>
            `);

            const addToCartButton = article.find('button');

            addToCartButton.on('click', event =>{

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
                    addToCart("rooms",room,article.find('#quantity').val());
                    location.reload();
                }
            });       
        
            section.append(article);
        });

    section.append(`</form>`);

    fragment.append(section);

    return fragment;
}