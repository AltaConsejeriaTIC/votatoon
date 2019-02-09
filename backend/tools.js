const aesjs = require('aes-js');

module.exports = {
  key: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],

  encrypted: function (text) {
    let textBytes = aesjs.utils.utf8.toBytes(text);
    let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
    let encryptedBytes = aesCtr.encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  },

  decrypted: function (textEncrypted) {
    let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
    let encryptedBytes = aesjs.utils.hex.toBytes(textEncrypted);
    let decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  },


};
