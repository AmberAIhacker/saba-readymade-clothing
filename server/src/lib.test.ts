import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { jsonArray, publicProduct, slugify } from "./lib.js";

describe("catalog serialization helpers", () => {
  it("creates readable URL slugs", () => {
    assert.equal(slugify("  Soft Cotton T-Shirt!  "), "soft-cotton-t-shirt");
  });

  it("reads only string values from persisted arrays", () => {
    assert.deepEqual(jsonArray('["M", 2, "L"]'), ["M", "L"]);
    assert.deepEqual(jsonArray("not json"), []);
  });

  it("returns parsed variants without leaking the storage representation", () => {
    const product = publicProduct({
      id: "p1", sizes: '["S","M"]', colors: '["Navy"]',
      images: '["https://example.com/shirt.jpg"]', keywords: '["cotton"]',
      category: { name: "Shirts" }
    });
    assert.deepEqual(product.sizes, ["S", "M"]);
    assert.deepEqual(product.colors, ["Navy"]);
    assert.equal(product.category && typeof product.category, "object");
    assert.equal("sizes" in product && typeof product.sizes, "object");
  });
});
