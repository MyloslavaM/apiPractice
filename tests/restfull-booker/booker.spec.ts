import { test } from "./booker-fixtures";

test("get booker", async ({ request }) => {
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
});
