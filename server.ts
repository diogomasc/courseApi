import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import scalarAPIReference from "@scalar/fastify-api-reference";

import { getCoursesRoute } from "./src/routes/get-course.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { deleteCoursesRoute } from "./src/routes/delete-course.ts";
import { updateCoursesRoute } from "./src/routes/update-course.ts";

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
}).withTypeProvider<ZodTypeProvider>();

// Swagger setup
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Course API",
      description: "API para gerenciar cursos",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// Checa os dados de entrada
server.setValidatorCompiler(validatorCompiler);
// Converte os dados de saída
server.setSerializerCompiler(serializerCompiler);

// Register routes
server.register(createCourseRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
server.register(updateCoursesRoute);
server.register(deleteCoursesRoute);

const start = async () => {
  try {
    await server.listen({ port: 3333 });
    console.log("Server is running on http://localhost:3333");
    console.log("Docs available at http://localhost:3333/docs");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
