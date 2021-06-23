import $ from 'jquery';
import {home, rooms, roomsDetail, treatments} from '../views';
import {signUp} from '../sign-up/sign-up';
import {signIn} from '../sign-up/sign-in';
import {cartSummary} from '../cart/cartSummary';

export const main = () => {
    const section =$('<section></section>')
    
    //Na start pokazujemy home
    section.append(home());

    document.addEventListener('navigation', event => {
        const detail = event.detail;

        switch(detail.view){
            case 'home':
                section.empty().append(home());
                break;
            case 'rooms':
                section.empty().append(rooms());
                break;
            case 'treatments':
                section.empty().append(treatments());
                break;
            case 'sign-up':
                section.empty().append(signUp());
                break;
            case 'sign-in':
                section.empty().append(signIn());
                break;
            case 'cartSummary':
                section.empty().append(cartSummary(true));
                break;
            case 'rooms-detail':
                section.empty().append(roomsDetail(detail.roomId));
                break;
            default:
                section.empty().append('Coś poszło nie tak :-(');
        }
    });

    return $(`<main></main>`).append(section);
};
