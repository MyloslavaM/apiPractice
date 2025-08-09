import { test, expect } from "@playwright/test";

const API_KEY = "JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4";

test("get info with date parameter", async ({ request }) => {
  const response = await request.get(
    `/planetary/apod?api_key=${API_KEY}&date=2025-08-01`
  );
  const json = await response.json();
  const headers = response.headers();

  expect(response.status()).toBe(200);
  expect(json.date).toBe("2025-08-01");
  expect(json.title).toBe("Small Dark Nebula");
  expect(json.copyright).toBe("Peter Bresseler");
  expect(headers["x-ratelimit-limit"]).toBe("4000");
});

test("get with data and thumbs ", { tag: ["@smoke"] }, async ({ request }) => {
  const params = {
    api_key: API_KEY,
    thumbs: true,
  };
  const responce = await request.get(
    `/planetary/apod?api_key=${API_KEY}&thumbs=true`
  );
  const json = await responce.json();
  expect(responce.status()).toBe(200);
});
test("get with start and end dates", async ({ request }) => {
  const start_date = "2025-08-01";
  const end_date = "2025-08-03";
  const responce = await request.get(
    `/planetary/apod?api_key=${API_KEY}&start_date=${start_date}&end_date=${end_date}`
  );
  const json = await responce.json();

  const dates = json.map((element) => element.date);
  console.log(dates);

  expect(responce.status()).toBe(200);
  expect(dates[0]).toBe("2025-08-01");
  expect(dates[1]).toBe("2025-08-02");
  expect(dates[2]).toBe("2025-08-03");
});
test("get data with no parameters", async ({ request }) => {
  const responce = await request.get(`/`);
  expect(responce.status()).toBe(200);
});
