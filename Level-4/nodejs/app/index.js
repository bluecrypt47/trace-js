// 	|-------------------------------------------|
// 	|                      						          |
//  |          Created by @d7cky				        |
// 	|											                      |
// 	|-------------------------------------------|

const express = require('express');
const nodeForge = require('node-forge');
const buffer = require('buffer');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

const DEFAULT_PRIVATE_KEY_CONST = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQCFceCQGLu5O+Zjq124HO79KKItjfncBVNZa22toEoyC6BemFoa\r\nqeH8UY6xcU3V0dA5L+ZlF8Tt6nbslDp0Tk88u5+AlGNO0jMCQRr8BwsEHEK5iwbC\r\nnfXPaXCUyCfytWt3YnrKaEa+yKznAJZDD1OhiHF4KE7N5WhPgQ9RHGwZVwIDAQAB\r\nAoGAd6AUTVi+wFkAOY0foLLfUzaf2/KQcDqd82UolyNAIAjoJKSy8YAlQ8ng/xSx\r\nT+KcpQdZpHpgYV90aLSgii7BPDdRfdC+4HQqxGVw2qME/cKkld0h+t/3t/J+pD1a\r\nxqItJsy9zBNnYLetZUf9Mccuo3wO/xz1WVg4tgxvg2VCN0ECQQD7X1Bw4dUgl4E7\r\nWOFWOSqMIMbQ+0rkHJ6WsVWD9+1eI8LnuDg3PfPvY0KX98qG4ud5ig6pX1dVakDh\r\nVZEYfq0RAkEAh+bJJSHnEeJe/WvcgHQk2Adq9WlNCCzfGk1vpsZV3MaZKuKsVLuh\r\nU5DbLP1Z1CmIK88lDJyFrQwxBnwcQBr/5wJAGjFzY1/U4oGHANUhHef1DAb6UJpu\r\n0lg9Gjy+SXMTM+UMETM8AF2fRomUTduPKgEI17xQDMwXgJoCyrgs112T0QJAKyWL\r\ngP2FhjkPnXfMNwAo3mlkfOvkqA7O+mPRaeqYQhLPeD0lJ3W2n3hjDaKWDXTuJbKL\r\nebiL/EfdnMh0k6m+ywJBAMmJqEgs5xphe5/dCj+h+y5CJHLLcKUKYEuHU+qk6OdG\r\nhDqCg4WoyN3Vqj31MKrnG5cNXmYh6aUieodyGXDYt6k=\r\n-----END RSA PRIVATE KEY-----\r\n"

function decryptAES(cipherText, aesKey) {
  try {
    var cipherTextBytes = nodeForge.util.decode64(cipherText);
    var ivBytes = cipherTextBytes.slice(0, 16);
    var textBytes = cipherTextBytes.slice(ivBytes.length, cipherTextBytes.length);
    var decryptCipher = nodeForge.cipher.createDecipher("AES-CTR", aesKey);
    decryptCipher.start({
        iv: ivBytes
    });
    decryptCipher.update(nodeForge.util.createBuffer(textBytes));
    decryptCipher.finish();
    return nodeForge.util.decodeUtf8(decryptCipher.output.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function decryptRSA(text, key) {
  try {
    const buff = buffer.Buffer.from(text, "base64");
    const privateKey = nodeForge.pki.privateKeyFromPem(key);
    return privateKey.decrypt(buff.toString("latin1"));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function encryptRSA(text, key) {
  const publicKey = nodeForge.pki.publicKeyFromPem(key);
  const buff = buffer.Buffer.from(publicKey.encrypt(text), "ascii");
  return buff.toString("base64");
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/front-end'));

app.post('/api/getTime', (req, res) => {
  const currentDate = new Date();
  res.json({
    'status': '200',
    'time': currentDate.getTime()
  });
});

app.post('/api/calculator', (req, res) => {
  const currentDate = new Date();
  const postData = async () => {
    const decryptKey = decryptRSA(req.body['k'], DEFAULT_PRIVATE_KEY_CONST);
    const decryptedData = decryptAES(req.body['d'], decryptKey);
    const decryptedCurrentTime = decryptAES(req.body['t'], decryptKey);

    if (parseInt(currentDate.getTime()) - parseInt(decryptedCurrentTime) <= 5000) {
      try {
        const options = {
          method: 'POST',
          url: 'http://typejuggling_level_1/calculator', 
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.parse(decryptedData),
        };
  
        const response = await axios(options);
        const responses = {
          "response": encryptRSA(JSON.stringify(response.data), nodeForge.util.decode64(req.body['p']))
        };
        res.json(responses);
      } catch (error) {
        console.error('Error:', error.message);
    }
    } else {
      try {
        const response_fail = {
          'status': '96',
          'message': 'Invalid request'
        };
        res.json({
          "response": encryptRSA(JSON.stringify(response_fail), nodeForge.util.decode64(req.body['p']))
        });
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  };

  postData()
});

app.post('/flag', (req, res) => {
  const currentDate = new Date();
  const decryptKey = decryptRSA(req.body['k'], DEFAULT_PRIVATE_KEY_CONST);
  const decryptedData = decryptAES(req.body['d'], decryptKey);
  const decryptedCurrentTime = decryptAES(req.body['t'], decryptKey);

  try {
    if (parseInt(currentDate.getTime()) - parseInt(decryptedCurrentTime) <= 5000) {
      if (JSON.parse(decryptedData)['num1'] == "d7cky" && JSON.parse(decryptedData)['num2'] == "minkhoy") {
        const response_flag = {
          'status': '200',
          'message': 'HPT{ThE_S3cuR1ty_s0lUti0N_0F_D7ckY_Level4_t1M3_b4S3_4nD_RsA_d3cr1pt}'
        };
        res.json({
          "response": encryptRSA(JSON.stringify(response_flag), nodeForge.util.decode64(req.body['p']))
        });
      } else {
        const response_time_error = {
          'status': '200',
          'message': 'Hok có flag douuuu bleee'
        };
        res.json({
          "response": encryptRSA(JSON.stringify(response_time_error), nodeForge.util.decode64(req.body['p']))
        });
      };
    } else {
      const response_fail = {
        'status': '96',
        'message': 'Invalid request'
      };
      res.json({
        "response": encryptRSA(JSON.stringify(response_fail), nodeForge.util.decode64(req.body['p']))
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Khởi động server
const port = 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
