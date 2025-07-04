// 	|-------------------------------------------|
// 	|                      						|
//  |          Created by @d7cky				|
// 	|											|
// 	|-------------------------------------------|

const forge = require('node-forge');
const axios = require('axios');
const buffer = require('buffer')
const URL = "http://level4.minkhoy.tech";
const DEFAULT_PUBLIC_KEY_CONST = "-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFceCQGLu5O+Zjq124HO79KKIt\r\njfncBVNZa22toEoyC6BemFoaqeH8UY6xcU3V0dA5L+ZlF8Tt6nbslDp0Tk88u5+A\r\nlGNO0jMCQRr8BwsEHEK5iwbCnfXPaXCUyCfytWt3YnrKaEa+yKznAJZDD1OhiHF4\r\nKE7N5WhPgQ9RHGwZVwIDAQAB\r\n-----END PUBLIC KEY-----\r\n"

function generateRsaKey() {
    const keypair = forge.pki.rsa.generateKeyPair(1024);
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    return {
      publicKeyPem,
      privateKeyPem
    };
}

function encryptRSA(text, key) {
    const publicKey = forge.pki.publicKeyFromPem(key);
    const buff = buffer.Buffer.from(publicKey.encrypt(text), "ascii");
    return buff.toString("base64");
}

function decryptRSA(text, key) {
    const buff = buffer.Buffer.from(text, "base64");
    const privateKey = forge.pki.privateKeyFromPem(key);
    return privateKey.decrypt(buff.toString("latin1"));
}

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
                alert("<h1>Tau lậy mày, chơi tới level4 rồi còn nhập chữ => giậnnnnnnnnnn</h1>");
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
            const {publicKeyPem, privateKeyPem} = generateRsaKey();
            const keyRandom = forge.random.getBytesSync(16);
            const hexKey = forge.util.bytesToHex(keyRandom);

            const checktimeFunc = async () => {
                const options = {
                    method: 'POST',
                    url: URL + '/api/getTime'
                };
            
                const response = await axios(options);
                return response.data.time;
            };
            checktimeFunc().then(result => {
                const time = result;
                const request = {
                    'd': encryptAES(JSON.stringify(data), hexKey),
                    'k': encryptRSA(hexKey, DEFAULT_PUBLIC_KEY_CONST),
                    't': encryptAES(time, hexKey),
                    'p': forge.util.encode64(publicKeyPem)
                };
                const header = {
                    'Content-Type': 'application/json',
                }
                fetch(URL + '/api/calculator', {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(request),
                }).then((response) => {
                    return response.text();
                }).then((response) => {
                    let parseJSONResponse = JSON.parse(decryptRSA(JSON.parse(response)['response'], privateKeyPem));
                    document.getElementById("result").value = parseJSONResponse.result;
                });
            });
        }

        document.getElementById("op").addEventListener("click", function(event) {
            sub = event.target.value;
            submitform(sub);
        });