const today = new Date();
export const todayStr = today.toISOString().split("T")[0];

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
export const yesterdayStr = yesterday.toISOString().split("T")[0];
