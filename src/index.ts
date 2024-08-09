import type { Serve } from "bun";

function fetch(request: Request) {
  return Response.json({ data: "Hello, Bun!" });
}

function error(err: Error) {
  return Response.json(err, { status: 500 });
}

export default {
  fetch,
  error,
} satisfies Serve;
