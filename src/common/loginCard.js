import $ from 'jquery';

export const loginCard = () => {

    const email = localStorage.getItem('userEmail');

    return $(`
        <div class="col-md-6">
            <h3>Login: ${email}</h3>
        </div>
    `);
};
