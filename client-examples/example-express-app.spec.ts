import { expect } from "chai";
import { agent as request } from "supertest";
import { EthWebhook } from "../test-data/test-data.spec";
import { app, server } from "./example-express-app";

describe("co-signing-service client server example", () => {
  it("responds to /", (done: any) => {
    request(app).get("/").expect(200, done);
  });

  it("404 everything else", (done: any) => {
    request(app).get("/foo/bar").expect(404, done);
  });

  describe("/co-sign", async () => {
    it("should throw an error for an invalid webhook signature", async () => {
      const webhook = { ...EthWebhook };
      const result = await request(app).post("/co-sign").send(webhook);
      expect(result.status).to.equal(500);
      expect(result.body.message).to.equal("Webhook hash signature mismatch");
    });
  });

  after(() => {
    server.close();
  });
});
