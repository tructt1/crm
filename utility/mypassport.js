var jwt = require('jsonwebtoken');
var config = require('../utility/key');

module.exports = {
    verifyToken: function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['access-token'];
        
        if (!token)
            return res.status(403).json({ message: 'No token provided.' });
        
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            
            req.decoded = decoded;
            next();
        });
    }
}