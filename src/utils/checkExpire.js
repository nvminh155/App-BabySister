


export default function checkExpire(start, end) {
    const cur = Date.now();

    return {
        "lt": cur < start,
        "process": cur >= start && cur <= end,
        "expired": cur > end,
    };
}
