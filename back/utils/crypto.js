//Import de crypto-js
const cryptojs = require("crypto-js");

exports.sha256 = string => {
    return cryptojs.SHA256(string).toString();
}