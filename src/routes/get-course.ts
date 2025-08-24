import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses, enrollments } from "../database/schema.ts";
// eq = equals, like = similar to, ilike = case-insensitive similar to
import { ilike, asc, and, SQL, eq, count } from "drizzle-orm";
import z from "zod";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all courses",
        preHandler: [checkRequestJwt, checkUserRole("manager")],
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["title", "id"]).optional().default("id"),
          page: z.coerce.number().optional().default(1),
          perPage: z.coerce.number().optional().default(10),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                enrollments: z.number(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page, perPage } = request.query;

      const conditions: SQL[] = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            enrollments: count(enrollments.courseId),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .where(and(...conditions))
          .groupBy(courses.id)
          .orderBy(asc(courses[orderBy]))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(courses, and(...conditions)),
      ]);

      return reply.send({
        courses: result.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description ?? "",
          enrollments: course.enrollments ?? 0,
        })),
        total,
      });
    }
  );
};
