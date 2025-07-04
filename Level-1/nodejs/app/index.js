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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/front-end'));

app.post('/api/calculator', (req, res) => {
  const postData = async () => {
    const de = decryptAES(req.body['data'], nodeForge.util.decode64(req.headers['key']));

    try {
      const options = {
        method: 'POST',
        url: 'http://typejuggling_level_1/calculator', 
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.parse(de),
      };

      const response = await axios(options);
      
      res.send(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  postData();
});

// Khởi động server
const port = 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
