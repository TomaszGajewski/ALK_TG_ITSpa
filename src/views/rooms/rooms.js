import $ from 'jquery';
import axios from 'axios';

export const rooms = () =>{
    const fragment = $(document.createDocumentFragment());

    const h2 = $('<h2>Pokoje</h2>');
    const section = $('<section></section>');

    fragment.append(h2, section);

    //Pobieramy pokoje z JSON-Server
    axios.get('http://localhost:3000/rooms')
        .then(response => response.data)
        .then(rooms => {
            const articles = rooms.map(room =>{
            const {id, name, beds, guests, price} = room;

                const article = $(`
                <article style="background: yellow; cursor: pointer">
                    <h4>${name}</h4>
                    <p><strong>Łóżka</strong> ${beds} | <strong>Gości</strong> ${guests} | <strong>Cena</strong> ${price.toFixed(2)} zł</p>
                </article>
                `);

                article.on('click', event =>{
                    event.preventDefault();

                    const navigationEvent = new CustomEvent('navigation', {
                        detail: {
                            view: 'rooms-detail',
                            roomId: id
                        }
                    });

                    document.dispatchEvent(navigationEvent);
                });

                return article;
            });

            section.empty().append(articles);
        });
    
    return fragment;
};