import { server } from "./app.ts";

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
