import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

test("Delete course by id", async () => {
  await server.ready();

  const course = await makeCourse();

  const deleteResponse = await request(server.server).delete(
    `/courses/${course.id}`
  );

  expect(deleteResponse.statusCode).toBe(200);
  expect(deleteResponse.body).toEqual({
    deleted: "Curso deletado com sucesso.",
  });

  const getResponse = await request(server.server).get(`/courses/${course.id}`);

  expect(getResponse.statusCode).toBe(404);
});
