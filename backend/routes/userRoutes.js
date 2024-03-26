const { userControllers } = require('../controllers');

// TODO: add payload validators for each path
module.exports = (server) => {
    // Signup
    server.post('/signup', (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            userControllers.signupUser(username, email, password, function (status, data) {
                if (status) {
                    res.status(201);
                    res.send({ success: true, message: "User sign up successful", data });
                    return next();
                } else {
                    res.status(400);
                    res.send({ success: false, message: data.message, error: data.name });
                    return next();
                }
            });
        } catch (error) {
            res.status(500);
            res.send({ success: false, error: error.name, message: error.message });
            return next();
        }
    });

    // Login
    server.post('/login', (req, res, next) => {
        const { username, password } = req.body;
        try {
            userControllers.loginUser(username, password, function (status, data) {
                if (status) {
                    res.status(200);
                    res.send({ success: true, message: "User login successful", data: data.data });
                    return next();
                } else {
                    res.status(400);
                    res.send({ success: false, message: data.message, error: data.name });
                    return next();
                }
            });
        } catch {
            res.status(500);
            res.send({ success: false, error: error.name, message: error.message });
            return next();
        }
    });

}
