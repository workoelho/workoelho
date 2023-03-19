import * as superstruct from "superstruct";

import { HttpError, getBody, render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";
import { Project, database } from "~/database";

export const url = "/projects";

async function handleGet(context: Context) {
  const projects = await database.project.findMany();
  render(context.response, <Page projects={projects} />);
}

async function handlePost(context: Context) {
  const data = await getBody(context.request, {
    name: superstruct.string(),
    description: superstruct.string(),
  });

  const project = await database.project.create({
    data,
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/projects/${project.id}`,
  });
  context.response.end();
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "GET":
      return handleGet(context);
    case "POST":
      return handlePost(context);
    default:
      throw new HttpError(405);
  }
}

type Props = {
  projects: Project[];
};

function Page({ projects }: Props) {
  return (
    <Layout>
      <h1>All projects</h1>

      <aside>
        <a href="/projects/new">Create new project</a>
      </aside>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map(({ id, name }) => (
            <li key={id}>
              <a href={`/projects/${id}`}>{name}</a>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
