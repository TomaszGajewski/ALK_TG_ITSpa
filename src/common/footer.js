import $ from 'jquery';

export const footer = () => {
    const year = (new Date()).getFullYear();


    return $(`
        <footer>
            <small>Wszelkie prawa zastrzeżone &copy; ${year}</small>
        </footer>
    `);
};
