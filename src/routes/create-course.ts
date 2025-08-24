import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { checkUserRole } from "./hooks/check-user-role.ts";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      preHandler: [checkRequestJwt, checkUserRole("manager")],
      schema: {
        tags: ["courses"],
        summary: "Create a course",
        body: z.object({
          title: z.string().min(5, "Título precisa ter 5 caracteres"),
          description: z.string().optional(),
        }),
        response: {
          201: z
            .object({ courseId: z.string().uuid() })
            .describe("Curso criado com sucesso!"),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;
      const courseDescription = request.body.description;

      const result = await db
        .insert(courses)
        .values({ title: courseTitle, description: courseDescription })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
