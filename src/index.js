import axios from 'axios';


const userList = document.querySelector('#users-list');
const restaurantList = document.querySelector('#restaurants-list');
const reservationsList = document.querySelector('#reservations-list');


const renderUsers = (users) => {
    const html = users.map( user =>`
        <li>
            <a href='#${user.id}'>
            ${ user.name }
            </a>
        </li>
    `).join('');
    userList.innerHTML = html
};


const renderRestaurants = (restaurants, hash) => {
    const html = restaurants.map( r =>`
        <li>
            ${ r.name }
                <button data-id='${r.id}'>Make Reservation</button>
        </li>
    `).join('');
    restaurantList.innerHTML = html
};

const renderReservations = (reservations) => {
    console.log(reservations)
    const html = reservations.map( r =>`
      <li>
        Reservation at ${r.restaurant.name}
        </li>
    `).join('');
    reservationsList.innerHTML = html
}

const render = async()=> {
    try{
        const hash = window.location.hash.slice(1);
        if(hash){
        const reservations = (await axios.get(`/api/users/${hash}/reservations`)).data;
        renderReservations(reservations);
        }
        const users = (await axios.get('/api/users')).data;
        const restaurants = (await axios.get('/api/restaurants')).data;
        renderUsers(users)
        renderRestaurants(restaurants, hash)
    } catch(err) {
        console.log(err)
    }
}

window.addEventListener('hashchange', () => {
    render()
})

restaurantList.addEventListener('click', async (ev)=> {
    const target = ev.target;
    const userId = window.location.hash.slice(1);
    if(target.tagName === 'BUTTON' && userId){
        const _restaurant = {restaurantId: target.getAttribute('data-id')}
        const response = (await axios.post(`/api/users/${userId}/reservations`, _restaurant)).data
        render()
    }
})

render()
