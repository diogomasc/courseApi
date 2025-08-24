import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { randomUUID } from "crypto";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("Update course by id", async () => {
  await server.ready();

  const course = await makeCourse();

  const updatedData = {
    title: `Updated Title ${randomUUID()}`,
    description: "Updated Description",
  };

  const { token } = await makeAuthenticatedUser("manager");

  const response = await request(server.server)
    .patch(`/courses/${course.id}`)
    .set("Authorization", token)
    .send(updatedData);

  expect(response.statusCode).toBe(200);
  expect(response.body.course).toEqual(
    expect.objectContaining({
      id: course.id,
      title: updatedData.title,
      description: updatedData.description,
    })
  );
});
