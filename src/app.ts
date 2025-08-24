import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { getCoursesRoute } from "./routes/get-courses.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { createCourseRoute } from "./routes/create-course.ts";
import { deleteCoursesRoute } from "./routes/delete-course.ts";
import { updateCoursesRoute } from "./routes/update-course.ts";
import { loginRoute } from "./routes/login.ts";

const server = fastify({
  logger:
    process.env.NODE_ENV === "development"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : false,
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
server.register(loginRoute);

export { server };
