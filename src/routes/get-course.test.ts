import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { randomUUID } from "crypto";

test("Get course", async () => {
  await server.ready();

  const titleID = randomUUID();
  const descriptionID = randomUUID();

  const course = await makeCourse(titleID, descriptionID);

  const response = await request(server.server).get(
    `/courses?search=${titleID}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleID,
        description: descriptionID,
        enrollments: 0,
      },
    ],
  });
});
