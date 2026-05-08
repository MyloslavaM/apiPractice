import { test as base } from "@playwright/test";

type Fixtures = {
  myName: string;
};
export const test = base.extend<Fixtures>({
  myName: "Mila",
  request: async ({ request }, use) => {
    console.log("-------- http request started ------");
    use(request);
    console.log("-------- test ended ------");
  },
});
