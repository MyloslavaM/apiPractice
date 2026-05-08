import { test, expect } from "@playwright/test";

test(
  " MM-001 get by id",
  {
    tag: ["@smoke"],
  },
  async ({ request }) => {
    const response = await request.get("/todos/1");
    const json = await response.json();
    const headers = response.headers();

    expect(response.status()).toBe(200);
    expect(json.userId).toBe(1);
    expect(json.id).toBe(1);
    expect(json.title).toBe("delectus aut autem");
    expect(Number(headers["x-ratelimit-limit"])).toBeLessThan(4000);
  },
);
test("MM-002 create a post  ", { tag: ["@smoke"] }, async ({ request }) => {
  const response = await request.post("/posts", {
    data: { title: "foo", body: "bar", userId: 1 },
  });

  const body = response.json();
  console.log(response);
  expect(response.status()).toBe(201);
});

test(
  "MM-003 update a post with put ",
  { tag: ["@smoke"] },
  async ({ request }) => {
    const response = await request.put("/posts/1", {
      data: { title: "foo", body: "bar", userId: 1 },
    });
    expect(response.status()).toBe(200);
  },
);

test(
  "MM-004 update a post with patch ",
  { tag: ["@smoke"] },
  async ({ request }) => {
    const response = await request.patch("/posts/1", {
      data: { body: "bar" },
    });

    expect(response.status()).toBe(200);
  },
);
test("MM-005 delete a post  ", { tag: ["@smoke"] }, async ({ request }) => {
  const response = await request.delete("/posts/1");

  expect(response.status()).toBe(200);
});
