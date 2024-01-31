


import moment from "moment";
import 'moment/locale/vi';



export default function formatDateTime(timestamp) {
    return {
        "DDMYTS": moment(timestamp).format('dddd,  LL  LTS'), // thứ bảy, 25 tháng 1 năm 2025 04:38:20,
        "DMY": moment(timestamp).format("LL"), // 25 thang 1 nam 2025
        "TS": moment(timestamp).format("LTS"), // // 09:53:18
        "T": moment(timestamp).format("LT")
    }
}