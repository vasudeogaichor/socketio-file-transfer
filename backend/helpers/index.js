const passwordValidator = require('password-validator');

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

module.exports = {
    validateEmail,
    validatePassword
}