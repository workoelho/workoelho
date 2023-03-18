import { HttpError, Id, render, validate } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";
import { Project, database } from "~/database";

export const url = "/projects/:id(\\d+)";

export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

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
