const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validateEmail, validatePassword, createToken } = require('../helpers');

module.exports = {
    signupUser: async (username, email, password, callback) => {
        const [isPasswordValid, errors] = validatePassword(password);
        if (!isPasswordValid) {
            callback(false, { message: errors });
            return;
        }

        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            callback(false, { message: 'Invalid email provided' });
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, username, password: hashedPassword });
            await user.save();
            const newToken = createToken(user);
            const data = {token: newToken, _id: user._id, email, username };
            callback(true, data);
        } catch (error) {
            callback(false, error);
        }
    },

    loginUser: async (username, password, callback) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                callback(false, 'Username/Password mismatch');
                return;
            }

            const loginSuccess = await bcrypt.compare(password, user.password);
            if (loginSuccess) {
                const newToken = createToken(user);
                const data = {token: newToken, _id: user._id, email: user.email, username: user.username };
                callback(true, { message: 'Login successful', data });
                return;
            } else {
                callback(false, { message: 'Username/Password mismatch' });
            }
        } catch (error) {
            callback(false, error);
        }
    }
}