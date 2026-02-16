/**
 * Parse date range string to { start, end } for report queries.
 * Supports: this_month, last_month, this_quarter, this_year, and "This Month" style.
 */
export function getReportDateRange(range) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const normalized = (range || "this_month").toString().toLowerCase().replace(/\s/g, "_");
    let start, end;
    switch (normalized) {
        case "last_month":
            start = new Date(year, month - 1, 1);
            end = new Date(year, month, 0, 23, 59, 59);
            break;
        case "this_quarter":
            const q = Math.floor(month / 3) + 1;
            start = new Date(year, (q - 1) * 3, 1);
            end = new Date(year, q * 3, 0, 23, 59, 59);
            break;
        case "this_year":
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31, 23, 59, 59);
            break;
        default: // this_month
            start = new Date(year, month, 1);
            end = new Date(year, month + 1, 0, 23, 59, 59);
    }
    return { start, end };
}
