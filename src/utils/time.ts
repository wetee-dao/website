export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 相对时间描述，如 "12hrs 26mins ago"
 */
export function timeAgo(date: Date | string | number): string {
    const then = typeof date === 'number' ? date : new Date(date).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - then);
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day > 0) return `${day}d ago`;
    if (hr > 0) return `${hr}hrs ${min % 60}mins ago`;
    if (min > 0) return `${min}mins ago`;
    return `${sec}secs ago`;
}

/**
 * 计算目标UTC时间距离当前时间的差值，并按规则格式化输出
 * 规则：
 * - 小于1分钟：XXs
 * - 1~10分钟：XXmXXs
 * - 10分钟~1天：XX小时XX秒
 * - 1天~1年：XX天XX小时
 * - 大于等于1年：XXyXX天
 * @param {string} targetTimeStr - 目标UTC时间字符串（ISO格式）
 * @returns {string} 格式化后的时间差文本
 */
export function formatTimeDiff(targetTimeStr: string, now: number): string {
    // 解析目标时间（UTC）和当前时间（UTC），转为毫秒级时间戳
    const targetTime = new Date(targetTimeStr).getTime();
    const nowTime = now || new Date().getTime();

    // 计算时间差（毫秒），取绝对值（兼容目标时间在当前时间前后）
    const diffMs = Math.abs(targetTime - nowTime);

    // 时间单位换算（毫秒）
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    // 按平年计算一年的毫秒数（365天），若需更精准可考虑闰年，此处取通用值
    const year = day * 365;

    // 计算各单位的差值
    const years = Math.floor(diffMs / year);
    const days = Math.floor((diffMs % year) / day);
    const hours = Math.floor((diffMs % day) / hour);
    const minutes = Math.floor((diffMs % hour) / minute);
    const seconds = Math.floor((diffMs % minute) / second);

    // 按规则格式化输出
    if (diffMs < minute) {
        // 小于1分钟：显示秒数
        return `${seconds} secs`;
    } else if (diffMs < 10 * minute) {
        // 小于10分钟：显示分+秒
        return `${minutes} mins ${seconds} secs`;
    } else if (diffMs < day) {
        // 10分钟~1天：显示小时+秒
        return `${hours} hrs ${seconds} mins`;
    } else if (diffMs < year) {
        // 1天~1年：显示天+小时
        return `${days} day ${hours} hrs`;
    } else {
        // 大于等于1年：显示年+天
        return `${years}y${days}d`;
    }
}
