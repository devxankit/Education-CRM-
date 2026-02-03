import dayjs from "dayjs";

export const durationPriority = {
  weekly: 1,
  monthly: 2,
  yearly: 3,
};

export const tierPriority = {
  starter: 1,
  pro: 2,
  business: 3,
};

export const getPlanDays = (type) => {
  if (type === "weekly") return 7;
  if (type === "monthly") return 30;
  if (type === "yearly") return 365;
};

export const isUpgradeAllowed = (currentPlan, newPlan) => {
  if (durationPriority[newPlan.planType] < durationPriority[currentPlan.planType]) return false;
  if (tierPriority[newPlan.planTier] < tierPriority[currentPlan.planTier]) return false;
  return true;
};
