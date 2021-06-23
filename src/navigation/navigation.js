import $ from 'jquery';
import {loginCard} from '../common'
import {cartSummary} from '../cart/cartSummary'

const button = text => $(`<button type="button">${text.toUpperCase()}</button>`);

const createNavigationEvent = view => new CustomEvent('navigation',{
    detail: {
        view: view
    }
});

export const navigation = () => {
    
    const nav = $(`<nav class="navbar navbar-expand-lg bg-secondary navbar-shrink" id="mainNav">
        <div class="container">
        </div>
    </nav>`)

    nav.prepend(loginCard());

    const homeButton = button('Strona domowa');
    homeButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('home'));
    });

    const roomsButton = button('Pokoje');
    roomsButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('rooms'));
    })

    const treatmentsButton = button('Usługi');
    treatmentsButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('treatments'));
    })

    const signUpButton = button('Rejestracja');
    signUpButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('sign-up'));
    })

    const signInButton = button('Logowanie');
    signInButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('sign-in'));
    })

    const cartSummaryButton = button('Koszyk');
    cartSummaryButton.on('click',function(event){
        event.preventDefault();
        document.dispatchEvent(createNavigationEvent('cartSummary'));
    })

    var cartShowSummary =  cartSummary();

    cartSummaryButton.hover(()=>{
        nav.find('.cart-dropdown').show();
    },
    () => {
        nav.find('.cart-dropdown').hide();
    });
                            
    nav.append(homeButton, roomsButton, treatmentsButton, signUpButton, signInButton, cartSummaryButton);

    nav.append(`<div class="cart-button">
    <div class="cart-dropdown"></div>`);

    nav.find('.cart-dropdown').append(cartShowSummary);

    nav.find('.cart-dropdown').hide();


    return nav;
}