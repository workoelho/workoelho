import { Status } from "~/src/shared/response";
import * as api from "~/src/feats/api";

async function POST(request: Request) {
  const data = await request.json();

  const organization = await api.organizations.create({
    payload: {
      name: data.name,
    },
  });

  return Response.json(organization, { status: Status.Created });
}

export async function fetch(request: Request) {
  switch (request.method) {
    case "POST":
      return await POST(request);
    default:
      return new Response(null, { status: Status.MethodNotAllowed });
  }
}
