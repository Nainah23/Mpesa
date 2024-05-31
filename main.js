const express = require('express');
const body_parser = require('body-parser');
const request = require('request');
const app = express();
app.use(body_parser.json());

//routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/home', (req, res) => {
    res.send('Home Page');
});
app.get('/token', access, (req, res) => {
    //access token
    res.status(200).json({access_token: req.access_token});
    
    });
app.get('/register', access, (req, resp) => {
    let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
    let auth = 'Bearer ' + req.access_token;

    request({
        url: url,
        method: 'POST',
        headers: {
            'Authorization': auth
        },
        json: {
            'ShortCode': '174379',
            'ResponseType': 'Completed',
            'ConfirmationURL': 'https://a4fb-102-212-239-10.ngrok-free.app/confirmation',
            'ValidationURL': 'https://a4fb-102-212-239-10.ngrok-free.app/validation'
        }
    },
    function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            resp.status(200).json({body});
        }
});
});
app.post('/confirmation', (req, res) => {
    console.log('Confirmation');
    console.log(req.body);
});
app.post('/validation', (req, resp) => {
    console.log('Validation');
    console.log(req.body);
});
app.get('/simulate', access, (req, res) => {
    let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
    let auth = 'Bearer ' + req.access_token;
    request({
        url: url,
        method: 'POST',
        headers: {
            'Authorization': auth
        },
        json: {
            'ShortCode': '174379',
            'CommandID': 'CustomerPayBillOnline',
            'Amount': '1',
            'Msisdn': '254708374149',
            'BillRefNumber': 'TestAPI'
        }
    },
    function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json({body});
        }
    });
});



function access(req, res, next) {
    let url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    let auth = new Buffer.from('ElWZeeAlgCFsb7VDjimsvDECyLK9gBBOKM0jKX5yED81azwp:ywYeUAxEXUuaI0farpoydNCOBrxmYSKO5YMUGTGYobTs8ZRif8Gvtz9nvjr2KVlJ').toString('base64');
    request({
        url: url,
        headers: {
            "Authorization": "Basic " + auth
        }
    },
    (error, response, body) => {
            if (error) {
                console.log(error);
            } else {
                req.access_token = JSON.parse(body).access_token;
                next();
            }
        });
}
app.listen(3000, (err, live) => {
    if (err) {
        console.error(err);
    }
    console.log('Server Live on port 3000');
});