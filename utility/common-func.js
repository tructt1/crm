var config = require('../utility/key');
var crypto = require('crypto');

module.exports = {
    encryptPassword : function (rawPassword) {
        var cipher = crypto.createCipher(config.algorithmPassword, config.keyPassword);
        var encryptedPassword = cipher.update(rawPassword, 'utf8', 'hex');
        encryptedPassword += cipher.final('hex');
        return encryptedPassword;
    },

    decryptPassword : function (encryptedPassword) {
        var decipher = crypto.createDecipher(config.algorithmPassword, config.keyPassword);
        var decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
        decryptedPassword += decipher.final('utf8');
        return decryptedPassword;
    },

    encryptSHA256 : function (rawText) {
        var hashString = crypto.createHash('sha256').update(rawText + config.keyPassword).digest('base64');
        return hashString;
    }
}