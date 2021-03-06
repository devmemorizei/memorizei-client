import axios from 'axios';

const urlBase = 'https://memorizei-api.herokuapp.com';
//const urlBaseDev = 'http://localhost:8090';

const urlBaseApi = `${urlBase}/api`;
//const URLBASEDEVAPI = `${urlBaseDev}/api`;

const getUrlApi = nameAPi => {
    return `${urlBaseApi}/${nameAPi}`;
}

const createUser = async (user) => {
    return axios.post(getUrlApi('user'), user)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const login = async userLogin => {
    return axios.post(getUrlApi('login'), userLogin)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const newPassword = async userLogin => {
    return axios.post(getUrlApi('newPassword'), null, { params: { email: userLogin } })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const changePassword = async (userLogin, oldPassword, newPassword) => {
    return axios.post(getUrlApi('changePassword'), null, { params: { email: userLogin, oldPassword: oldPassword, newPassword: newPassword } })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const verifyToken = async token => {
    return axios.get(getUrlApi('verifyTokenIsValid'), { params: { token: token} })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
}

const getUser = async userEmail => {
    return axios.get(getUrlApi('user'), { params: { userEmail: userEmail} })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
}

const updateUser = async user => {
    return axios.put(getUrlApi('user'), user, { params: { email: user.email } })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const getBooks = async () => {
    return axios.get(getUrlApi('book'))
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const getUserAnswers = async (bookId, titleId, chapterId) => {
    return axios.get(getUrlApi('book/getUserAnswers'), { params: { bookId: bookId, titleId: titleId, chapterId: chapterId }})
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
};

const saveAnswerUser = async (objDataAnswer) => {
    return axios.post(getUrlApi('book/userAnswer'), objDataAnswer)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error.response;
    });
}

axios.interceptors.request.use(
    config => {
      const { origin } = new URL(config.url);
      const allowedOrigins = [urlBase];
      const token = localStorage.getItem('token');
      if (allowedOrigins.includes(origin)) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

export { createUser, 
         login, 
         newPassword, 
         changePassword, 
         verifyToken, 
         updateUser, 
         getUser, 
         getBooks, 
         getUserAnswers,
         saveAnswerUser };