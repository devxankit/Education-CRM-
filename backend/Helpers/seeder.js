import Institute from "../Models/InstituteModel.js";

export const seedDefaultAdmin = async () => {
    try {
        const count = await Institute.countDocuments();
        if (count === 0) {
            await Institute.create({
                adminName: "Super Admin",
                email: "admin@gmail.com",
                password: "123",
                legalName: "Default Institute",
                type: "school"
            });
            console.log("✅ Default Admin Created: admin@gmail.com / 123");
        }
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
    }
};
