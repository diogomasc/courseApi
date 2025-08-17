import fastify from "fastify";
import crypto from "node:crypto";

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

const courses = [
  { id: "1", title: "JavaScript Basics" },
  { id: "2", title: "Advanced Node.js" },
  { id: "3", title: "Full-Stack Development" },
];

server.get("/courses", (request, reply) => {
  return reply.send({ courses });
});

server.get("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;
  const course = courses.find((course) => course.id === courseId);

  if (!course) {
    return reply.status(404).send({ error: "Curso não encontrado." });
  }

  return { course };
});

server.post("/courses", (request, reply) => {
  type Body = {
    title: string;
  };

  const body = request.body as Body;
  const courseTitle = body.title;

  if (!courseTitle) {
    return reply.status(400).send({ error: "Título do curso é obrigatório." });
  }

  const courseId = crypto.randomUUID();
  courses.push({ id: courseId, title: courseTitle });

  reply.status(201).send({ id: courseId });
});

server.listen({ port: 3333 }).then(() => {
  console.log("Server is running on http://localhost:3333");
});
