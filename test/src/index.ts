import {Hono} from 'hono';
import {serve} from "@hono/node-server";
import { cors } from 'hono/cors';
// import {streamSSE} from "hono/dist/types/helper/streaming/index.js";
import { streamSSE } from 'hono/streaming'

const app = new Hono();

// Apply CORS middleware to all routes
app.use('*', cors({
  origin: '*', // Specify the allowed origin
  methods: 'GET, OPTIONS', // Specify allowed methods
  headers: 'Content-Type, Authorization', // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers)
}));

// Middleware for SSE headers
app.use('/sse/*', (c, next) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  return next();
});

// SSE Endpoint
app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
      let id:int = 0
    while (true) {
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})

// Start server
serve({ fetch: app.fetch, port: 3000 });