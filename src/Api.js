import axios from 'axios';

const urlBase = 'https://memorizei-api.herokuapp.com/api';
//const urlBaseDev = 'http://localhost:8090/api';

const createUser = async (user) => {
    return axios.post(`${urlBase}/user`, user)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

export { createUser };