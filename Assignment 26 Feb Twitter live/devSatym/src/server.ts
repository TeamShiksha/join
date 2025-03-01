import Fastify from "fastify";
import bookRoutes from "./routes/bookRoutes";

const fastify = Fastify({ logger: true });

// Register Routes
fastify.register(bookRoutes);

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("🚀 Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
