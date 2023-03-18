import { HttpError, render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";
import { Project, database } from "~/database";

export const url = "/projects";

export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

  const projects = await database.project.findMany();

  render(context.response, <Page projects={projects} />);
}

type Props = {
  projects: Project[];
};

function Page({ projects }: Props) {
  return (
    <Layout>
      <h1>All projects</h1>
      <ul>
        {projects.map(({ id, name }) => (
          <li key={id}>
            <a href={`/projects/${id}`}>{name}</a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
