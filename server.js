const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const request = require('request');

app.get('/api/user/:user_id', (req, res) => {
    getUserById(req.params.user_id).then((user) => {
        return res.send(user);
    }).catch((err) => {
        res.status(500);
        return res.send({message: err.message});
    });
});

app.get('/api/user/:user_id/avatar', (req, res) => {

    getUserById(req.params.user_id).then((user) => {
        let imagePath = path.resolve('images') + '/avatar.jpg';

        if (fs.existsSync(imagePath)) {
            fs.readFile(imagePath, {encoding: 'base64'}, (err, image) => {
                if (err) {
                    res.status(500);
                    return res.send(err.message);
                } else {
                    return res.send(image);
                }
            });
        } else {
            request.get(user.avatar, function (err, httpResponse, body) {
                if (err) {
                    res.status(500);
                    return res.send(err.message);
                } else {

                    fs.writeFile(imagePath, body.toString('base64'), {encoding: 'base64'}, (err) => {
                        if (err) {
                            res.status(500);
                            return res.send(err);
                        } else {
                            return res.send('The file has been saved!');
                        }
                    });
                }
            });
        }
    }).catch((err) => {
        res.status(500);
        return res.send({message: err.message});
    });
});

app.delete('/api/user/:user_id/avatar', (req, res) => {
    let imagePath = path.resolve('images') + '/avatar.jpg';

    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                res.status(500);
                return res.send(err.message);
            } else {
                return res.send({message: 'Image removed successfully!'});
            }
        });
    }
});

let getUserById = (userId) => {
    return new Promise(function (resolve, reject) {
        request.get('https://reqres.in/api/users/' + userId, function (err, httpResponse, body) {
            if (err) {
                return reject(err.message);
            } else {
                return resolve(JSON.parse(body).data);
            }
        });
    });
};

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
