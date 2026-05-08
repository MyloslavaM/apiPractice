import { test, expect, APIResponse } from "@playwright/test";
import { TIMEOUT } from "dns";
import Joi from "joi";

let token: string;
let createdBookingId: number;
test.beforeAll(async ({ request }) => {
  const result: APIResponse = await request.post("/auth", {
    data: {
      username: "admin",
      password: "password123",
    },
  });
  const json = await result.json();
  token = json.token;
});

test(`update existing booking`, async ({ request }) => {
  const result = await request.post("/booking", {
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    failOnStatusCode: true,
  });
  const jsonPost = await result.json();
  const bookingId = jsonPost.bookingid;
  expect(bookingId).toBeDefined();

  const updateResult = await request.put(`/booking/${bookingId}`, {
    data: {
      firstname: "James",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    headers: {
      Cookie: `token=${token}`,
    },
  });
  expect(updateResult.status()).toBe(200);
});

test(`create booking, headers should exist`, async ({ request }) => {
  const result = await request.post(`/booking`, {
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    failOnStatusCode: true,
  });

  const expectedHeaders = {
    "content-length": "195",
    "content-type": "application/json; charset=utf-8",
    date: "Thu, 26 Feb 2026 18:40:43 GMT",
    etag: 'W/"c3-7xN6g7lKAzLxIMWQop8Kdv8pK1Y"',
    nel: '{"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}',
    "report-to":
      '{"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=q8sUgdGYw9PTe2T47axWuUWoo%2Bx%2BHs7jfl5S1fcyBa8%3D\\u0026sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add\\u0026ts=1772131243"}],"max_age":3600}',
    "reporting-endpoints":
      'heroku-nel="https://nel.heroku.com/reports?s=q8sUgdGYw9PTe2T47axWuUWoo%2Bx%2BHs7jfl5S1fcyBa8%3D&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&ts=1772131243"',
    server: "Heroku",
    via: "1.1 heroku-router",
    "x-powered-by": "Express",
  };

  const headers = result.headers();

  for (const key in expectedHeaders) {
    expect(headers[key]).toBeDefined();
  }
});

test(`create booking, json schema should be verified`, async ({ request }) => {
  const result = await request.post(`/booking`, {
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
    failOnStatusCode: true,
  });
  const json = await result.json();
  const bookingSchema = Joi.object({
    additionalneeds: Joi.string().required(),
    totalprice: Joi.number().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    depositpaid: Joi.boolean().required(),
    bookingdates: Joi.object({
      checkin: Joi.date().required(),
      checkout: Joi.date().required(),
    }),
  });

  const schema = Joi.object({
    bookingid: Joi.number().required(),
    booking: bookingSchema,
  });

  const validationResult = schema.validate(json);
  expect(validationResult.error).toBeUndefined();
});

test(`get created bookings, validate schema`, async ({ request }) => {
  const resultPost = await request.post(`/booking`, {
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-02",
      },
      additionalneeds: "Breakfast",
    },
    failOnStatusCode: true,
  });
  const postJson = await resultPost.json();
  createdBookingId = postJson.bookingid;

  const resultGet = await request.get(`/booking/${createdBookingId}`, {
    failOnStatusCode: true,
  });
  expect(resultGet.status()).toBe(200);
});
