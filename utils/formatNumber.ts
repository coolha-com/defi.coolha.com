'use client'

export function formatNumber(number: number | undefined | null, decimals: number = 2): string {
    if (number == null) { // 检查 number 是否为 null 或 undefined
        return '';
    }

    // 如果数字很大，使用简化格式
    if (number >= 1e9) {
        const formatted = (number / 1e9).toFixed(1);
        return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}B` : `${formatted}B`;
    } else if (number >= 1e6) {
        const formatted = (number / 1e6).toFixed(1);
        return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}M` : `${formatted}M`;
    } else if (number >= 1e3) {
        const formatted = (number / 1e3).toFixed(1);
        return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}K` : `${formatted}K`;
    }
    
    // 对于较小的数字，使用指定的小数位数
    return Number(number.toFixed(decimals)).toString();
}

// 格式化货币
export function formatCurrency(number: number | undefined | null, decimals: number = 2): string {
    if (number == null) {
        return '$0.00';
    }
    return `$${formatNumber(number, decimals)}`;
}

// 格式化百分比
export function formatPercentage(number: number | undefined | null, decimals: number = 2): string {
    if (number == null) {
        return '0%';
    }
    return `${formatNumber(number, decimals)}%`;
}

// 格式化大数字（用于区块链金额）
export function formatBigNumber(value: bigint, decimals: number, displayDecimals: number = 4): string {
    const divisor = BigInt(10 ** decimals);
    const quotient = value / divisor;
    const remainder = value % divisor;
    
    const integerPart = quotient.toString();
    const fractionalPart = remainder.toString().padStart(decimals, '0');
    
    const fullNumber = `${integerPart}.${fractionalPart}`;
    const num = parseFloat(fullNumber);
    
    return formatNumber(num, displayDecimals);
}
