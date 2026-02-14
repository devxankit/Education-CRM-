import Tax from "../Models/TaxModel.js";

/**
 * Calculate tax amount on a base amount based on applicable tax rules.
 * @param {number} baseAmount - The base amount (e.g. fee total) to calculate tax on
 * @param {string} branchId - Branch ID to fetch applicable taxes
 * @param {string} applicableOn - 'fees' | 'transport' | 'admission' | 'hostel' | 'all'
 * @param {string} [instituteId] - Optional institute ID for query
 * @returns {Promise<{totalTax: number, breakdown: Array<{name: string, code: string, amount: number, rate: number, type: string}>}>}
 */
export const calculateTax = async (baseAmount, branchId, applicableOn = "fees", instituteId) => {
    if (!baseAmount || baseAmount <= 0) {
        return { totalTax: 0, breakdown: [] };
    }

    const query = {
        branchId,
        isActive: true,
        $or: [{ applicableOn }, { applicableOn: "all" }],
    };
    if (instituteId) query.instituteId = instituteId;

    const taxes = await Tax.find(query).lean();

    const breakdown = [];
    let totalTax = 0;

    for (const tax of taxes) {
        let amount = 0;
        if (tax.type === "percentage") {
            amount = Math.round((baseAmount * (tax.rate || 0)) / 100);
        } else {
            amount = tax.rate || 0;
        }
        totalTax += amount;
        breakdown.push({
            name: tax.name,
            code: tax.code,
            amount,
            rate: tax.rate,
            type: tax.type,
        });
    }

    return { totalTax, breakdown };
};

/**
 * Calculate tax from a pre-fetched array of tax rules (no DB call).
 * @param {number} baseAmount - Base amount
 * @param {Array} taxes - Array of tax documents with rate, type, applicableOn
 * @param {string} applicableOn - Filter: 'fees' | 'transport' | etc.
 */
export const calculateTaxFromRules = (baseAmount, taxes, applicableOn = "fees") => {
    if (!baseAmount || baseAmount <= 0 || !taxes?.length) {
        return { totalTax: 0, breakdown: [] };
    }
    const applicable = taxes.filter(
        (t) => t.isActive && (t.applicableOn === applicableOn || t.applicableOn === "all")
    );
    let totalTax = 0;
    const breakdown = applicable.map((tax) => {
        const amount =
            tax.type === "percentage"
                ? Math.round((baseAmount * (tax.rate || 0)) / 100)
                : tax.rate || 0;
        totalTax += amount;
        return { name: tax.name, code: tax.code, amount, rate: tax.rate, type: tax.type };
    });
    return { totalTax, breakdown };
};
