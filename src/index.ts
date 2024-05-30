import type { Serve } from "bun";

export default {
  fetch(request) {
    return Response.json({ data: "Hello, Bun!" });
  },
  error(err) {
    return Response.json(err, { status: 500 });
  },
} satisfies Serve;
