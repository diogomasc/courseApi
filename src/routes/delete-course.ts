import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { eq } from "drizzle-orm";
import z from "zod";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const deleteCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/courses/:id",
    {
      preHandler: [checkRequestJwt, checkUserRole("manager")],
      schema: {
        tags: ["courses"],
        summary: "Delete course by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            deleted: z.string(),
          }),
          404: z.object({ error: z.string() }).describe("Curso não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const params = request.params;

      const result = await db
        .delete(courses)
        .where(eq(courses.id, params.id))
        .returning();

      if (result.length > 0) {
        return reply.send({ deleted: "Curso deletado com sucesso." });
      }
      return reply.status(404).send({ error: "Curso não encontrado." });
    }
  );
};
