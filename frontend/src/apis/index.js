import axios from 'axios';
const BASE_URL = 'http://localhost:8504';

const signupUser = async (data) => {
    console.log(data)
    const options = {
        method: 'POST',
        url: BASE_URL + '/signup',
        data
    };
    try {
        const res = await axios.request(options);
        return res.data
    } catch (error) {
        return error.response.data;
    }
};

export {
    signupUser
}