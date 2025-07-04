// 	|-------------------------------------------|
// 	|                      						|
//  |          Created by @d7cky				|
// 	|											|
// 	|-------------------------------------------|

const forge = require('node-forge');
const KEY = "3cc1599496e9d01ea6947ff77dc83476";
const URL = "http://level1.minkhoy.tech";

        function encryptAES(plaintext) {
            const ivRandom = forge.random.getBytesSync(16);
            const ivHex = forge.util.bytesToHex(ivRandom);
            const iv = forge.util.hexToBytes(ivHex);
            const cipher = forge.cipher.createCipher('AES-CTR', KEY);

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
            const regex = /^\d*$/; // Regular expression to match only digits
            
            if (!regex.test(num1) || !regex.test(num2)) {
                alert("Hôg thík ai nhập chữ dô máy tánh đou nhoa !!!!!");
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
            const request = {
                'data': encryptAES(JSON.stringify(data))
            };
            const header = {
                'Content-Type': 'application/json',
                'key': forge.util.encode64(KEY)
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

        }

        document.getElementById("op").addEventListener("click", function(event) {
            sub = event.target.value;
            submitform(sub);
        });