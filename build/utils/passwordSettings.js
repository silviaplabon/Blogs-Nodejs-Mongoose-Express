const CryptoJS = require('crypto-js');
const passwordSettings = {
  encryptedPassword: async (password) => {
    let hashPassword = '';
    hashPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET,
    ).toString();
    console.log(hashPassword);
    return hashPassword;
  },
  passwordIsMatched: async (password, encryptedPassword) => {
    const bytes = await CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.PASSWORD_SECRET,
    );
    console.log(bytes, '@@@@@@@@@@@@');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log(
      originalText,
      password,
      '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
    );
    if (password == originalText) {
      return true;
    } else {
      return false;
    }
  },
};

module.exports = passwordSettings;
