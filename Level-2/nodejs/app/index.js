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
    const decryptedData = decryptAES(req.body['data'], nodeForge.util.decode64(req.headers['key']));
    const decryptedChecksum = decryptAES(req.headers['checksum'], nodeForge.util.decode64(req.headers['key']));

    if (decryptedData.length == decryptedChecksum) {
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
        
        res.send(response.data);
      } catch (error) {
        console.error('Error:', error.message);
    }
    } else {
      const response = {
        'status': '96',
        'message': 'Invalid request'
      };
      res.json(response);
    }
  };

  postData();
});

app.post('/flag', (req, res) => {
  const decryptedData = decryptAES(req.body['data'], nodeForge.util.decode64(req.headers['key']));
  const decryptedChecksum = decryptAES(req.headers['checksum'], nodeForge.util.decode64(req.headers['key']));

  if (decryptedData.length == decryptedChecksum) {
    try {
      const response_flag = {
        'status': '200',
        'message': 'HPT{ThE_S3cuR1ty_s0lUti0N_0F_D7ckY_Level2_l3ngth_r3qu3St}'
      };
        
      res.send(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  } else {
    const response = {
      'status': '96',
      'message': 'Invalid request'
    };
    res.json(response);
  }

});

// Khởi động server
const port = 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
