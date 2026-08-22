import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

const nsNull = Symbol("NSNull");

async function loadResponseClasses() {
  const source = await readFile("mnutils.js", "utf8");
  const responseStart = source.indexOf("class Response {");
  const headersStart = source.indexOf("// 用于管理响应头的类");
  const headersEnd = source.indexOf("class MNWebview {", headersStart);
  assert.notEqual(responseStart, -1);
  assert.notEqual(headersStart, -1);
  assert.ok(responseStart < headersStart);

  const mnUtil = {
    isNSNull(value) {
      return value === nsNull;
    },
    getStatusCodeDescription(status) {
      return `status ${status}`;
    },
    dataToString(data) {
      return data.text;
    },
  };
  const jsonValue = { ok: true };
  const nsJsonSerialization = {
    isValidJSONObject(value) {
      return value === jsonValue;
    },
    JSONObjectWithDataOptions() {
      return jsonValue;
    },
  };
  const factory = new Function(
    "MNUtil",
    "NSJSONSerialization",
    `${source.slice(responseStart, headersStart)}\n${source.slice(headersStart, headersEnd)}\nreturn { Response, Headers };`
  );
  return factory(mnUtil, nsJsonSerialization);
}

test("Response.new handles a successful response without an error object", async () => {
  const { Response } = await loadResponseClasses();
  const response = Response.new({ statusCode: () => 201 }, null, null, "https://example.test", {
    "Content-Type": "application/json",
  });
  assert.equal(response.status, 201);
  assert.equal(response.ok, true);
  assert.equal(response.url, "https://example.test");
  assert.equal(response.headers.get("content-type"), "application/json");
});

test("Response.new handles null and undefined errors without dereferencing them", async () => {
  const { Response } = await loadResponseClasses();
  assert.equal(Response.new(null, null, null).status, 200);
  assert.equal(Response.new(null, null, undefined).status, 200);
  assert.equal(responseErrorDescription(Response.new(null, null, null)), undefined);
});

test("Response.new treats NSNull as an absent error and preserves network errors", async () => {
  const { Response } = await loadResponseClasses();
  assert.equal(Response.new(null, null, nsNull).status, 200);
  const networkError = { localizedDescription: "timed out" };
  const response = Response.new(null, null, networkError, "https://example.test");
  assert.equal(response.status, 0);
  assert.equal(response.ok, false);
  assert.equal(response.error, "timed out");
});

test("Response exposes an empty body and parsed JSON consistently", async () => {
  const { Response } = await loadResponseClasses();
  const empty = Response.new({ statusCode: () => 204 }, null, null);
  assert.equal(empty.body, undefined);

  const data = { text: "{\"ok\":true}", length: () => 11 };
  const response = Response.new({ statusCode: () => 200 }, data, null);
  assert.deepEqual(response.json(), { ok: true });
  assert.equal(response.text(), "{\"ok\":true}");
});

function responseErrorDescription(response) {
  return response.error;
}
