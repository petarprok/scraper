const CronJob = require('cron').CronJob;
const request = require('request');
const fs = require('fs');
let page = 1;
const path = require('path');

new CronJob('*/1 * * * *', function () {
    console.log('You will see this message every minute' + new Date());

    request.get('https://reqres.in/api/users?page=' + page, function (err, httpResponse, body) {
        if (err) {
            return reject(err.message);
        } else {
            page++;

            let filePath = path.resolve() + '/users.json';
            let users = JSON.parse(body).data;

            if (users.length > 0) {
                if (fs.existsSync(filePath)) {
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.log(err);
                        }

                        let savedUsersInFile = JSON.parse(data);
                        users = savedUsersInFile.concat(users);

                        fs.writeFile(filePath, JSON.stringify(users, null, 4), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                } else {
                    fs.writeFile(filePath, JSON.stringify(users, null, 4), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        }
    });
}, null, true);
