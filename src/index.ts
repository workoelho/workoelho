import type { Serve } from "bun";

export default {
  fetch(request) {
    return new Response(JSON.stringify({ data: "Hello, Bun!" }));
  },
} satisfies Serve;
