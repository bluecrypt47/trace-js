// 	|-------------------------------------------|
// 	|                      						|
//  |          Created by @d7cky				|
// 	|											|
// 	|-------------------------------------------|

const forge = require('node-forge');
const axios = require('axios');
const URL = "http://level3.minkhoy.tech";
// const URL = "http://localhost";

        function encryptAES(plaintext, key) {
            const ivRandom = forge.random.getBytesSync(16);
            const ivHex = forge.util.bytesToHex(ivRandom);
            const iv = forge.util.hexToBytes(ivHex);
            const cipher = forge.cipher.createCipher('AES-CTR', key);

            cipher.start({ iv: iv });
            cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
            cipher.finish();

            const encrypted = forge.util.bytesToHex(cipher.output.data);
            const encryptedByte = iv.concat(forge.util.hexToBytes(encrypted));

            return forge.util.encode64(encryptedByte);
        }

        function submitform(sub) {
            const num1 = document.getElementById("num1").value;
            const num2 = document.getElementById("num2").value;
            const op = sub;
            const regex = /^\d*$/; 
  
            if (!regex.test(num1) || !regex.test(num2)) {
                alert("<h1>Đéo cho nhập chữ nghen, nhập nữa cọc ó !!!!!!!!</h1>");
            } else {
                const data = {
                    num1: num1.trim(),
                    num2: num2.trim(),
                    sub: op.trim()
                };
                const result = sendRequest(data);
                document.getElementById("result").value = result;
            }
        }

        function sendRequest(data) {
            const keyRandom = forge.random.getBytesSync(16);
            const hexKey = forge.util.bytesToHex(keyRandom);

            const checktimeFunc = async () => {
                const options = {
                    method: 'GET',
                    url: '/api/getTime'
                };
            
                const response = await axios(options);
                return response.data.time;
            };
            checktimeFunc().then(result => {
                const time = result;
                const request = {
                    'data': encryptAES(JSON.stringify(data), hexKey)
                };
                const header = {
                    'Content-Type': 'application/json',
                    'key': forge.util.encode64(hexKey),
                    't': encryptAES(time, hexKey)
                }
                fetch(URL + '/api/calculator', {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(request),
                }).then((response) => {
                    return response.text();
                }).then((response) => {
                    let parseJSONResponse = JSON.parse(response);
                    document.getElementById("result").value = parseJSONResponse.result;
                });
            });
        }

        document.getElementById("op").addEventListener("click", function(event) {
            sub = event.target.value;
            submitform(sub);
        });