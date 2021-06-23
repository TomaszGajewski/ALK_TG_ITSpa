const cartName = "cart";

export const saveCart = function (object) {
    var stringified = JSON.stringify(object);
    localStorage.setItem(cartName,stringified);
    return true;
  };

  export const loadCart = function () {
    return JSON.parse(localStorage.getItem(cartName));
  };

  export const clearCart = function () {
    localStorage.removeItem(cartName);
    return true;
  };

  export const addToCart = function (type, value, quantity = 0) {
    var cart = loadCart();

    if(cart == null)
    {
      cart = require('../cart/cart.js'); 
      saveCart(cart);
      cart = loadCart();
    }
    var addSuccessfully = false;

    if(type == "rooms" || type == "treatments")
    {
      if(cart[type] != null)
      {
        cart[type].forEach((element, index, object) => {
          if(element.id == value.id)
          {
            element.quantity = parseInt(element.quantity) + parseInt(quantity);

            if(element.quantity == 0)
            {
              object.splice(index, 1);
            }
            window.confirm("Zmiana została zapisana w koszyku");
            
            addSuccessfully = true;
          }
        });
      }
      if(!addSuccessfully)
      {
        value.quantity = quantity;
        cart[type].push(value);
        addSuccessfully = true;
      }

      if(addSuccessfully)
      {
        saveCart(cart);
        window.confirm("Zmiana została zapisana w koszyku");
      }
      else
      {
        window.alert("Zmiana w koszyku się nie powiodła");
      }
    }
    else
    {
      cart[type] = value;
      saveCart(cart);
    }
  };