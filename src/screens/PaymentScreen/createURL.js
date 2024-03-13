import moment from "moment";
import { payment } from "../../constants/payment";
import hmacSHA512 from "../../utils/hmacSHA512";
import { sortObject } from "./sortObject";
export function createURL(price) {

    var date = new Date();
    let ipAddr = "::1";
  
    var tmnCode = payment.vnp_TmnCode;
    var secretKey = payment.vnp_HashSecret;
    var vnpUrl = payment.vnp_Url;
    var returnUrl = payment.vnp_ReturnUrl;
  
    var orderId =  moment(date).format("DDHHmmss");
    var amount = parseInt(price);
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    var bankCode = "VNBANK";
  
    var orderInfo = "tetst";
    var orderType = "???";
    var locale = "vn";
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
  
    vnp_Params = sortObject(vnp_Params);
  
    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    vnp_Params['vnp_SecureHash'] = hmacSHA512(signData, secretKey);
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    // console.log("SIGN", cryp(signData))
    // vnp_Params = sortObject(vnp_Params);
    return vnpUrl;
  }