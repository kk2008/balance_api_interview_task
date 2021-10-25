const request = require("request");

let GET = (url) => {
    return new Promise((resolve, reject) => {
        try {
            request(url, { json: true }, (err, res, body) => {
                if (err) reject(err);
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports.GET = GET;

let POST = (data) => {
    return new Promise((resolve, reject) => {
        try {
            request.post(data, (err, res, body) => {
                if (err) reject(err);
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports.POST = POST;