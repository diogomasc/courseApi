import fastify from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      sub: string;
      role: "student" | "manager";
    };
  }
}
