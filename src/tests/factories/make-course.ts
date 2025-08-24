import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export async function makeCourse(title?: string, description?: string) {
  const result = await db
    .insert(courses)
    .values({
      title: title ?? faker.lorem.words(10),
      description: description ?? faker.lorem.words(10),
    })
    .returning();

  return result[0];
}
