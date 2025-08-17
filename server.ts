import { eq } from "drizzle-orm";
import fastify from "fastify";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

// TODO: Criar rotas e documentação swagger

// GET /courses
server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);
  return reply.send({ courses: result });
});

// GET /courses/:id
server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  if (result.length > 0) {
    return { course: result[0] };
  }

  return reply.status(404).send({ error: "Curso não encontrado." });
});

// POST /courses
server.post("/courses", async (request, reply) => {
  type Body = {
    title: string;
    description?: string;
  };

  const body = request.body as Body;
  const courseTitle = body.title;

  if (!courseTitle) {
    return reply.status(400).send({ error: "Título do curso é obrigatório." });
  }

  const result = await db
    .insert(courses)
    .values({ title: courseTitle, description: body.description })
    .returning();

  reply.status(201).send({ courseId: result[0].id });
});

// PATCH /courses/:id
server.patch("/courses/:id", async (request, reply) => {
  type Params = { id: string };
  type Body = { title?: string; description?: string };
  const params = request.params as Params;
  const body = request.body as Body;

  if (!body.title && !body.description) {
    return reply
      .status(400)
      .send({ error: "Informe ao menos um campo para atualizar." });
  }

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
});

// DELETE /courses/:id
server.delete("/courses/:id", async (request, reply) => {
  type Params = { id: string };
  const params = request.params as Params;

  const result = await db
    .delete(courses)
    .where(eq(courses.id, params.id))
    .returning();

  if (result.length > 0) {
    return reply.send({ deleted: true });
  }
  return reply.status(404).send({ error: "Curso não encontrado." });
});

server.listen({ port: 3333 }).then(() => {
  console.log("Server is running on http://localhost:3333");
});
