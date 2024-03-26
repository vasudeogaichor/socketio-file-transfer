const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "6fc5825be51c7154873188b54df06bccf08d1da8fc91e368b9e7802105d7814afd2d744c9a4cac20b59f55c3934ea9aecb1dda852f7ecb4532eb8b25d9e77bba";

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password) {
    const schema = new passwordValidator();
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123']);

    if (!schema.validate(password)) {
        let errors = [];

        if (!schema.has().min(8).validate(password)) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!schema.has().uppercase().validate(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!schema.has().lowercase().validate(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!schema.has().digits().validate(password)) {
            errors.push('Password must contain at least one digit');
        }
        if (!schema.has().not().spaces().validate(password)) {
            errors.push('Password must not contain spaces');
        }

        return [false, errors]
    } else {
        return [true]
    }
}

function createToken({username, _id}) {
    return jwt.sign({ username, _id }, JWT_SECRET, {
        expiresIn: '24h' // Token expiration time
    });
}

async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}


module.exports = {
    validateEmail,
    validatePassword,
    createToken,
    verifyToken
}