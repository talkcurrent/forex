import CryptoJs from "crypto-js";

const key = CryptoJs.enc.Hex.parse("zAL7X5AVRm8l4Ifs");
const iv = CryptoJs.enc.Hex.parse("BE/s3V0HtpPsE+1x");

const Encrypt = (payload) => {
  return CryptoJs.AES.encrypt(payload, key, {
    iv,
  }).toString();
};

const Decrypt = (payload) => {
  const decryptedres = CryptoJs.AES.decrypt(payload, key, {
    iv,
  }).toString(CryptoJs.enc.Utf8);

  return decryptedres;
};

export { Encrypt, Decrypt };
