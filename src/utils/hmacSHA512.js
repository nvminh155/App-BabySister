import CryptoJS from 'crypto-js';

export default function hmacSHA512(signData, secretKey) { 
    const hmac = CryptoJS.HmacSHA512(signData, secretKey);
    const signed = hmac.toString(CryptoJS.enc.Hex);
    // console.log("🚀 ~ cryp ~ hmac:", hmac)
    // vnp_Params['vnp_SecureHash'] = signed;
    return signed
}