import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { eq } from "drizzle-orm";
import z from "zod";

export const updateCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Update course by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
          })
          .refine(
            (data) =>
              data.title !== undefined || data.description !== undefined,
            {
              message: "Informe ao menos um campo para atualizar.",
            }
          ),
        response: {
          200: z.object({
            course: z.object({
              id: z.string().uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          400: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const params = request.params;
      const body = request.body;

      const result = await db
        .update(courses)
        .set({
          ...(body.title ? { title: body.title } : {}),
          ...(body.description ? { description: body.description } : {}),
        })
        .where(eq(courses.id, params.id))
        .returning();

      if (result.length > 0) {
        return reply.send({ course: result[0] });
      }
      return reply.status(404).send({ error: "Curso não encontrado." });
    }
  );
};
