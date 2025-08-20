import { isMetaIP } from "../src/index";

describe("isMetaIP", () => {
  test("devrait retourner true pour une IP Meta (69.63.189.44)", () => {
    expect(isMetaIP("69.63.189.44")).toBe(true);
  });

  test("devrait retourner false pour une IP hors liste (8.8.8.8)", () => {
    expect(isMetaIP("8.8.8.8")).toBe(false);
  });

  test("devrait retourner true pour une autre IP Meta (2a03:2880::1)", () => {
    expect(isMetaIP("2a03:2880::1")).toBe(true);
  });

  test("devrait retourner false pour une IP IPv6 hors liste (2001:4860:4860::8888)", () => {
    expect(isMetaIP("2001:4860:4860::8888")).toBe(false);
  });
});
