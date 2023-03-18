import { Id, render, validate } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";

export const url = "/projects/:id(\\d+)";

export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    context.response.statusCode = 405;
    return;
  }

  const { id: projectId } = validate(context.url.pathname.groups, {
    id: Id,
  });

  if (projectId === null) {
    context.response.statusCode = 400;
    return;
  }

  if (projectId === 3) {
    throw new Error();
  }

  context.response.statusCode = 200;
  context.response.setHeader("Content-Type", "text/html; charset=utf-8");
  context.response.end(render(<Page projectId={projectId} />));
}

type Props = {
  projectId: number;
};

function Page({ projectId }: Props) {
  return (
    <Layout title={`Project #${projectId}`}>
      <h1>Project #{projectId}</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
        aperiam eaque necessitatibus illo impedit nulla minima nostrum inventore
        tempore. Ea placeat eaque architecto debitis dolor consectetur
        voluptatibus odio explicabo illo.
      </p>
    </Layout>
  );
}
