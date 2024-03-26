import axios from 'axios';
const BASE_URL = 'http://localhost:8504';

const makeRequest = async (options) => {
    try {
        const res = await axios.request(options);
        return res.data
    } catch (error) {
        return error.response.data;
    }
}

const signupUser = async (data) => {
    console.log(data)
    const options = {
        method: 'POST',
        url: BASE_URL + '/signup',
        data
    };
    
    return await makeRequest(options);
};

const loginUser = async(data) => {
    console.log(data)
    const options = {
        method: 'POST',
        url: BASE_URL + '/login',
        data
    };

    return await makeRequest(options);
}

export {
    signupUser,
    loginUser
}