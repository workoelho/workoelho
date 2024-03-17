import type { Organization, Session, User } from "~/src/lib/server/prisma";
import * as email from "~/src/lib/server/email";

type Props = {
  session: Session & { user: User; organization: Organization };
};

export async function send({ session }: Props) {
  return await email.send({
    from: "Workoelho <help@workoelho.com>",
    to: `${session.user.name} <${session.user.email}>`,
    subject: "Recovery at Workoelho",
    body: <Body session={session} />,
  });
}

function Body({ session }: Props) {
  const resetUrl = `${process.env.APP_URL}/reset?sessionId=${session.id}`;

  return (
    <div>
      <h1>Recovery</h1>

      <p>
        Hi! Someone requested an access recovery at Workoelho to{" "}
        <code>{session.user.email}</code>.
      </p>

      <p>
        To proceed, you can <a href={resetUrl}>reset your password</a>.
      </p>

      <p>Otherwise you can safely ignore this message.</p>

      <hr />

      <p>©️ 2023 Workoelho</p>
    </div>
  );
}
