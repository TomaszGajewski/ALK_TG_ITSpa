import $ from 'jquery';

export const home = () =>{
    const fragment = $(document.createDocumentFragment());

    const h2 = $('<h2>Strona domowa</h2>');
    const p = $('<p>Lorem ipsum – tekst składający się z łacińskich i quasi-łacińskich wyrazów, mający korzenie w klasycznej łacinie, wzorowany na fragmencie traktatu Cycerona „O granicach dobra i zła” napisanego w 45 p.n.e. Tekst jest stosowany do demonstracji krojów pisma, kompozycji kolumny</p>');

    fragment.append(h2, p);
    
    return fragment;
};