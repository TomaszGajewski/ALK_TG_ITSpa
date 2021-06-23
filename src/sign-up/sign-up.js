import $ from 'jquery';
import axios from 'axios';
import {required} from '../common/required';
import {short} from './short';
import {mismatch} from './mismatch';
import {calculateComplexity} from './calculateComplexity';

export const signUp = () => {
    const fragment = $(document.createDocumentFragment());
    const h2 = $('<h2>Rejestracja</h2>');
    const form = $(`
        <form name="signUp" autocomplete="off" novalidate>
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" class="form-control" type="text">
                <p id="email-required" class="text-danger">Email jest wymagany.</p>
            </div>  

            <div class="form-group">
                <label for="password">Hasło</label>
                <input id="password" class="form-control" type="password">
                <p id="password-required" class="text-danger">Hasło jest wymagane.</p>
                <p id="password-short" class="text-danger">Hasło jest za krótkie</p>
            </div>

            <div class="form-group">
                <label for="repeat-password">Powtórzenie hasła</label>
                <input id="repeat-password" class="form-control" type="password">
                <p id="repeat-password-mismatch" class="text-danger">Hasło nie jest poprawne.</p>
            </div>

            <progress id="passwordComplexity" value="0" max="6"></progress>

            <div class="form-group">
                <button type="button">Rejestracja</button>
                <p id="user-exists" class="text-danger">Email już istnieje w bazie</p>
            </div>
        </form>
    `);

    const button = form.find('button');
    const progress = form.find('#passwordComplexity');
    const password = form.find('#password');

    const errorMessages = {
        email: {
            required: form.find('#email-required')
        },
        password: {
            required: form.find('#password-required'),
            short: form.find('#password-short')
        },
        repeatPassword: {
            mismatch: form.find('#repeat-password-mismatch')
        },
        button:{
            userExists: form.find('#user-exists')
        }
    };

    const validate = (validation, errorMessage) => {
        validation ? errorMessage.show() : errorMessage.hide();
    }

    errorMessages.email.required.hide();
    errorMessages.password.required.hide();
    errorMessages.password.short.hide();
    errorMessages.repeatPassword.mismatch.hide();
    errorMessages.button.userExists.hide();

    password.on('keyup', event =>{
        const complexity = calculateComplexity($('#password').val());

        progress.prop('value', complexity.value);
        progress.prop('max', complexity.max);
    });

    button.on('click', event =>{
        const email = $('#email').val();
        const password = $('#password').val();
        const repeatPassword = $('#repeat-password').val();
        const isEmailRequired = required(email);
        const isPasswordRequired = required(password);
        const isPasswordShort = short(password);
        const isPasswordMismatched = mismatch(password, repeatPassword);

        validate(required(email), errorMessages.email.required);
        validate(required(password), errorMessages.password.required);
        validate(short(password), errorMessages.password.short);
        validate(mismatch(password, repeatPassword), errorMessages.repeatPassword.mismatch);

        const data = {
            email: email,
            p: password,
            newUser: true
        };

        //Sprawdzamy czy uzytkownik juz istnieje
        if(!isEmailRequired && !isPasswordRequired && !isPasswordShort && !isPasswordMismatched){
            axios.get('http://localhost:3000/users')
                .then(response => response.data)
                .then(users => {
                    const user = users.find(usr=>usr.email === data.email && usr.p === data.p);
                    if(!user){
                        axios.post('http://localhost:3000/users', data).then(console.log);
                    }
                    else{
                        validate(true, errorMessages.button.userExists);
                    }
                })  
        }

    
        // czyscimy wszystkie inputy
        $('#email').prop('value', '');
        $('#password').prop('value', '');
        $('#repeat-password').prop('value', '');
    });

    fragment.append(h2, form);
    return fragment;
}