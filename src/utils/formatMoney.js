




export default function formatMoney (amount) {
    const val = parseInt(amount)
      ? parseInt(amount).toLocaleString("vi-VN")
      : "0";
    return val;
  };