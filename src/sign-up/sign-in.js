import $ from 'jquery';
import axios from 'axios';
import {required} from '../common/required';
import {saveCart} from '../cart/cartAdapter';

export const signIn = () => {
    const fragment = $(document.createDocumentFragment());
    const h2 = $('<h2>Logowanie</h2>');
    const form = $(`
        <form name="signIn" autocomplete="off" novalidate>
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" class="form-control" type="text">
                <p id="email-required" class="text-danger">Email jest wymagany.</p>
            </div>  

            <div class="form-group">
                <label for="password">Hasło</label>
                <input id="password" class="form-control" type="password">
                <p id="password-required" class="text-danger">Hasło jest wymagane.</p>
            </div>

            <div class="form-group">
                <button type="button">Zaloguj</button>
                <p id="email-or-password-wrong" class="text-danger">Email lub hasło jest niepoprawne.</p>
            </div>
        </form>
    `);

    const button = form.find('button');

    const errorMessages = {
        email: {
            required: form.find('#email-required')
        },
        password: {
            required: form.find('#password-required')
        },
        button: {
            userExists: form.find('#email-or-password-wrong')
        }
    };

    const validate = (validation, errorMessage) => {
        validation ? errorMessage.show() : errorMessage.hide();
    }

    errorMessages.email.required.hide();
    errorMessages.password.required.hide();
    errorMessages.button.userExists.hide();

    button.on('click', event =>{
        const email = $('#email').val();
        const password = $('#password').val();
        const isEmailRequired = required(email);
        const isPasswordRequired = required(password);

        validate(required(email), errorMessages.email.required);
        validate(required(password), errorMessages.password.required);
        validate(false, errorMessages.button.userExists);

        const data = {
            email: email,
            p: password,
            newUser: true
        };

        //Sprawdzamy czy uzytkowniok istnieje
        if(!isEmailRequired && !isPasswordRequired){
            axios.get('http://localhost:3000/users')
                .then(response => response.data)
                .then(users => {
                    const user = users.find(usr=>usr.email === data.email && usr.p === data.p);
                    if(user){
                        localStorage.setItem('userEmail',user.email);
                        const cart = require('../cart/cart.js'); 
                        saveCart(cart);
                        location.reload();
                    }
                    else{
                        validate(true, errorMessages.button.userExists);
                    }
                })  
        }
    
        // czyscimy wszystkie inputy
        $('#email').prop('value', '');
        $('#password').prop('value', '');
    });

    fragment.append(h2, form);
    return fragment;
}