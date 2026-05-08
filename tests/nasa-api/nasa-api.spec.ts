import { test, expect } from "@playwright/test";

const API_KEY = "JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4";
const today = new Date();
export const todayStr = today.toISOString().split("T")[0];

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
export const yesterdayStr = yesterday.toISOString().split("T")[0];

const dayBeforeYesterday = new Date();
dayBeforeYesterday.setDate(today.getDate() - 2);
export const dayBeforeYesterdayStr = dayBeforeYesterday
  .toISOString()
  .split("T")[0];

const testData = [
  {
    testId: "MM-0002",
    params: {
      api_key: API_KEY,
      start_date: "2026-02-01",
      end_date: "2026-02-01",
    },
  },
  {
    testId: "MM-0003",
    params: {
      api_key: API_KEY,
      start_date: "2025-07-01",
      end_date: "2025-08-01",
    },
  },
];

for (const { testId, params } of testData) {
  test(
    `${testId} get info with date parameter`,
    { tag: ["@smoke"] },
    async ({ request }) => {
      const response = await request.get(`/planetary/apod`, { params: params });

      expect(response.status()).toBe(200);
      const body = await response.json();

      for (const item of body) {
        expect(item).toHaveProperty("date");
        expect(typeof item.date).toBe("string");
      }

      const headers = await response.headers();
      expect(headers["content-type"]).toBe("application/json");
    },
  );
}

const testData02 = [
  {
    testId: "MM-0004",
    params: {
      api_key: API_KEY,
      start_date: yesterdayStr,
      end_date: todayStr,
      thumbs: "True",
    },
  },
  {
    testId: "MM-0005",
    params: {
      api_key: API_KEY,
      start_date: yesterdayStr,
      end_date: todayStr,
      thumbs: "False",
    },
  },
];
for (const { testId, params } of testData02) {
  test(
    `${testId} get with data and thumbs parameters`,
    { tag: ["@smoke"] },
    async ({ request }) => {
      const response = await request.get(`/planetary/apod`, { params: params });

      expect(response.status()).toBe(200);
    },
  );
}
const testData3 = [
  {
    testId: "MM-0007",
    params: {
      params: {
        api_key: API_KEY,
        start_date: yesterdayStr,
        end_date: todayStr,
      },
    },
  },
  {
    testId: "MM-0008",
    params: {
      api_key: API_KEY,
      start_date: "2025-07-01",
      end_date: "2025-08-01",
    },
  },
];
for (const { testId, params } of testData3) {
  test(`${testId} get with start and end dates`, async ({ request }) => {
    const response = await request.get(`/planetary/apod`, { params: params });

    expect(response.status()).toBe(200);
  });
}
test("MMN-004, get data with no parameters", async ({ request }) => {
  const response = await request.get(`/`);
  expect(response.status()).toBe(200);
});
