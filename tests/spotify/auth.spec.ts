import { test } from "@playwright/test";

test("get token", async ({ request }) => {
  const response = request.post("", {
    data: {
      grant_type: "client_credentials",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });
  expect(response.status()).toBe(200);
  const token = (await response).json;
});
