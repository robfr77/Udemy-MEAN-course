const jwt = require('jsonwebtoken');

// export a middleware function (executed on incoming request) to protect POST, PUT, DELETE routes for authenticated users
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // convention: header used for attaching authorization info to request. Get the second string in it, after the "Bearer". Could also use query parameter.
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next(); // let the execution continue
    } catch (error) {
        res.status(401).json({
            message: 'You are not authenticated!'
        });
    }
};