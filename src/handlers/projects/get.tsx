import { Context, Id, render, validate } from "~/shared";
import Layout from "~/layout";

export const url = "/projects/:id(\\d+)";

export function handler(context: Context) {
  if (context.method !== "GET") {
    return { statusCode: 405 };
  }

  const { id: projectId } = validate(context.url.pathname.groups, {
    id: Id,
  });

  if (projectId === null) {
    return { statusCode: 400 };
  }

  if (projectId === 3) {
    throw new Error();
  }

  return {
    body: render(<Page projectId={projectId} />),
  };
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
