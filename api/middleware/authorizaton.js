const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('x-auth-token');
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');

    try {
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null) res.status(401).send('Not authorized');
        jwt.verify(token, process.env.TOKEN_SECERET_KEY, (error, user) => {
            if (error) res.status(403).send('Invalid token')
            req.user = user;
            next();
        });
    }
    catch (ex) {
        res.status(400).send('Invalid token');
    }

}