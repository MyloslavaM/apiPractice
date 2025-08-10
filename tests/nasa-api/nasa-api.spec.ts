import { test, expect } from "@playwright/test";
import { todayStr, yesterdayStr } from "../../data/testData";

const API_KEY = "JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4";
const START_DATE = yesterdayStr;
const END_DATE = todayStr;

test(
  "get info with date parameter",
  { tag: ["@smoke"] },
  async ({ request }) => {
    const params = {
      api_key: API_KEY,
      date: "2025-08-01",
    };
    const responce = await request.get(`/planetary/apod?`, { params: params });
    const json = await responce.json();
    const headers = responce.headers();

    expect(responce.status()).toBe(200);
    expect(json.date).toBe("2025-08-01");
    expect(json.title).toBe("Small Dark Nebula");
    expect(json.copyright).toBe("Peter Bresseler");
    expect(headers["x-ratelimit-limit"]).toBe("4000");
  }
);

test(
  "get with data and thumbs parameters",
  { tag: ["@smoke"] },
  async ({ request }) => {
    const params = {
      api_key: API_KEY,
      thumbs: true,
    };
    const responce = await request.get(`/planetary/apod?`, { params: params });
    const headers = responce.headers();
    const json = await responce.json();
    expect(responce.status()).toBe(200);
    expect(headers["x-ratelimit-limit"]).toBe("4000");
  }
);
test("get with start and end dates", async ({ request }) => {
  const params = {
    api_key: API_KEY,
    start_date: START_DATE,
    end_date: END_DATE,
  };
  const responce = await request.get(`/planetary/apod`, { params: params });
  const json = await responce.json();

  const dates = json.map((element) => element.date);
  console.log(dates);

  expect(responce.status()).toBe(200);
  expect(dates[0]).toBe(START_DATE);
  expect(dates[1]).toBe(END_DATE);
});
test("get data with no parameters", async ({ request }) => {
  const responce = await request.get(`/`);
  expect(responce.status()).toBe(200);
});
