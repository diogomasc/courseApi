import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeUser } from "../tests/factories/make-user.ts";

test("login", async () => {
  await server.ready();

  const { user, passwordBeforeWash } = await makeUser();

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({
      email: user.email,
      password: passwordBeforeWash,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    Ok: "Login realizado com sucesso",
  });
});
