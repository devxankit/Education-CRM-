/**
 * Finance Mock Data for Admin Module
 * Taxes, Fee Structures, etc.
 */

export const initialTaxes = [
    { id: 1, name: 'GST (Standard)', code: 'GST-18', rate: 18, type: 'percentage', applicableOn: 'fee', isActive: true, description: 'Goods and Services Tax - Standard Rate' },
    { id: 2, name: 'GST (Reduced)', code: 'GST-5', rate: 5, type: 'percentage', applicableOn: 'expenses', isActive: true, description: 'GST for transport and essential services' },
    { id: 3, name: 'Education Cess', code: 'EDU-CESS', rate: 3, type: 'percentage', applicableOn: 'fee', isActive: true, description: 'Education cess on tuition fees' },
    { id: 4, name: 'Service Charge', code: 'SVC-FEE', rate: 500, type: 'fixed', applicableOn: 'admission', isActive: false, description: 'Fixed service charge for admissions' },
];

export const feeStructures = [
    { id: 'FS-001', name: 'Annual Tuition (10th)', amount: 45000, frequency: 'Annual', class: 'Class 10' },
    { id: 'FS-002', name: 'Transport (Zone A)', amount: 1500, frequency: 'Monthly', class: 'All' },
];

export default {
    initialTaxes,
    feeStructures
};
