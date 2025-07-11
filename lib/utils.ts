export function formatCurrency(value: number | undefined | null): string {
    if (typeof value !== "number") return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatTime(date: string | number | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // optional: handle invalid dates

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}