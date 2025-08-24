import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("Delete course by id", async () => {
  await server.ready();

  const course = await makeCourse();

  const { token } = await makeAuthenticatedUser("manager");

  const deleteResponse = await request(server.server)
    .delete(`/courses/${course.id}`)
    .set("Authorization", token);

  expect(deleteResponse.statusCode).toBe(200);
  expect(deleteResponse.body).toEqual({
    deleted: "Curso deletado com sucesso.",
  });
});
