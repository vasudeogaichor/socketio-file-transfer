const {userControllers} = require('../controllers');

module.exports = (server) => {
    // Signup
    server.post('/signup', (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            userControllers.signupUser(username, email, password, function(status, data) {
                if (status) {
                    res.status(201);
                    res.send({success: true, message: "User sign up successful", data});
                    return next();
                } else {
                    res.status(400);
                    res.send({success: false, message: data.message, error: data.name});
                    return next();
                }
            });
        } catch (error) {
            console.log('errror - ', error)
            res.status(500);
            res.send({ success: false, error: error.name, message: error.message });
            return next();
        }
    });

    // Login
    server.post('/login', (req, res, next) => {
        const { email, password } = req.body;

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    res.status(404)
                    res.send({ success: false, message: 'User not found' });
                    return next();
                }

                return bcrypt.compare(password, user.password);
            })
            .then(isPasswordValid => {
                if (!isPasswordValid) {
                    res.status(401)
                    res.send({ success: false, message: 'Invalid password' });
                    return next();
                }

                res.status(200)
                res.send({ success: true, message: 'Login successful' });
                return next();
            })
            .catch(error => {
                res.status(500)
                res.send({ success: false, message: 'Failed to login', error: error.message });
                return next();
            });
    });
}
