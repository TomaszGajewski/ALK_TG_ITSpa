import $ from 'jquery';
import axios from 'axios';
import { addToCart } from '../../cart/cartAdapter';

export const treatments = () =>{

    const fragment = $(document.createDocumentFragment());

    const h2 = $('<h2>Usługi</h2>');
    const section = $('<section></section>');

    fragment.append(h2, section);

    //Pobieramy pokoje z JSON-Server
    axios.get('http://localhost:3000/treatments')
        .then(response => response.data)
        .then(treatments => {
            const articles = treatments.map(treatment =>{
            const {id, name, area, time, price} = treatment;

                const article = $(`
                <article style="background: yellow;">
                    <h4>${name}</h4>
                    <p><strong>Obszar</strong> ${area} | <strong>Czas</strong> ${time} | <strong>Cena</strong> ${price.toFixed(2)} zł</p>
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
                    addToCart("treatments",treatment, article.find('#quantity').val());
                    location.reload();
                });       

                return article;
            });

            section.empty().append(articles);
        });
    
    return fragment;
};