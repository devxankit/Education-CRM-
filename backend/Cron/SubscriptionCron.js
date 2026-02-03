import cron from "node-cron";
import Subscription from "../Models/SubscriptionModel.js";
import razorpay from "../Config/razorpay.js";
import dayjs from "dayjs";
import { getPlanDays } from "../Helpers/SubscriptioDetails.js";

export const subscriptionExpiryCron = cron.schedule("0 * * * *", async () => {
  try {
    console.log("🕒 Running subscription expiry cron...");

    const now = new Date();
    /* =====================================================
   CASE 1: Expire Cancelled Subscriptions (Razorpay End Date)
   - status = cancelled
   - Razorpay subscription end_at passed
===================================================== */

    const cancelledSubs = await Subscription.find({
      status: "cancelled",
      isDeleted: false,
    });

    for (let sub of cancelledSubs) {
      if (!sub.subscriptionDetails?.end_at) continue;

      const razorpayEndDate = new Date(sub.subscriptionDetails.end_at * 1000);

      if (razorpayEndDate > now) continue; // abhi expire nahi hui

      sub.status = "expired";
      await sub.save();

      console.log(`❌ Cancelled subscription expired: ${sub._id}`);
    }

    /* =====================================================
       CASE 2: Expire Free Subscriptions (1 week old)
       - finalPayableAmount = 0
       - createdAt >= 7 days
    ===================================================== */
    const freeSubsToExpire = await Subscription.find({
      status: "active",
      isDeleted: false,
      finalPayableAmount: 0,
      createdAt: { $lte: dayjs(now).subtract(7, "day").toDate() },
    });

    for (let sub of freeSubsToExpire) {
      sub.status = "expired";
      await sub.save();
      console.log(`❌ Free subscription expired: ${sub._id}`);
    }

    /* =====================================================
       CASE 3: Expire Paid Active Subscriptions & Create New Pending
       - Use Razorpay end date (subscriptionDetails.end_at)
    ===================================================== */
    const activePaidSubs = await Subscription.find({
      status: "active",
      isDeleted: false,
      finalPayableAmount: { $gt: 0 },
    }).populate("planId");

    for (let sub of activePaidSubs) {
      if (!sub.subscriptionDetails?.end_at) continue;

      const razorpayEndDate = new Date(sub.subscriptionDetails.end_at * 1000);
      if (razorpayEndDate > now) continue; // not yet expired

      // Expire old subscription
      sub.status = "expired";
      await sub.save();
      console.log(`❌ Old active subscription expired: ${sub._id}`);

      const plan = sub.planId;

      if (plan && plan.razorpayPlanId) {
        // Create new Razorpay subscription
        const razorpaySubscription = await razorpay.subscriptions.create({
          plan_id: plan.razorpayPlanId,
          customer_notify: 1,
          total_count: 12,
        });

        // Create new subscription in DB
        const newSub = await Subscription.create({
          adminId: sub.adminId,
          planId: plan._id,
          status: "pending",
          finalPayableAmount: plan.planPrice,
          razorpaySubscriptionId: razorpaySubscription.id,
          razorpaySubscriptionUrl: razorpaySubscription.short_url,
        });

        console.log(`✅ New paid subscription created: ${newSub._id}`);
      }
    }

    console.log("✅ Subscription expiry cron finished.");
  } catch (err) {
    console.error("Cron Error:", err);
  }
});
