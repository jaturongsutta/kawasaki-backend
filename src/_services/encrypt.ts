import * as crypto from 'crypto';
export class EncryptData {
  private static algorithm = 'aes-128-ecb';
  private static secretKey = 'FTH@2022!QAZ@WSX'; // 16 characters i.e 16*8=128 bits

  static async encrypt(plainText: string) {
    // console.log('plainText : ', plainText);
    const cipher = crypto.createCipheriv(
      EncryptData.algorithm,
      EncryptData.secretKey,
      null,
    );
    const encrypted = Buffer.concat([
      cipher.update(plainText),
      cipher.final(),
    ]).toString('hex');
    // console.log('encrypted : ', encrypted);
    return encrypted;
  }

  static async decrypt(cipherText: string) {
    // console.log("cipherText : ", cipherText);
    const _cipherText = Buffer.from(cipherText, 'hex');
    const cipher = crypto.createDecipheriv(
      EncryptData.algorithm,
      EncryptData.secretKey,
      null,
    );
    const decrypted = Buffer.concat([
      cipher.update(_cipherText),
      cipher.final(),
    ]).toString('utf8');
    console.log('decrypted : ', decrypted);
    return decrypted;
  }

  static hash(cipherText: string) {
    // console.log('cipherText : ', cipherText);
    const hashPassword = crypto
      .createHash('sha256')
      .update(cipherText)
      .digest('hex');

    return hashPassword;
  }
}
