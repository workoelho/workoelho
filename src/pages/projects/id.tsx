import { HttpError, Id, render, validate } from "~/src/shared";
import Layout from "~/src/pages/layout";
import { Project, database } from "~/src/database";
import { Context } from "~/src/types";

export const url = "/projects/:id(\\d+)";

async function handleGet(context: Context) {
  const { id: projectId } = validate(context.url.pathname.groups, {
    id: Id,
  });

  if (projectId === null) {
    throw new HttpError(400);
  }

  const project = await database.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new HttpError(404);
  }

  render(context.response, <Page project={project} />);
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "GET":
      return handleGet(context);
    default:
      throw new HttpError(405);
  }
}

type Props = {
  project: Project;
};

function Page({ project }: Props) {
  return (
    <Layout title={project.name}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </Layout>
  );
}
