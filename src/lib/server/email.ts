import { writeFile } from "fs/promises";

// import { renderToStaticMarkup } from "react-dom/server";
import { Resend } from "resend";

declare const global: { resend: Resend };

const resend = global.resend ?? new Resend(process.env.RESEND_API_KEY);

const defaultSender = "Workoelho <help@workoelho.com>";

if (process.env.NODE_ENV !== "production") {
  global.resend = resend;
}

type Params = {
  from?: string;
  to: string;
  subject: string;
  body: JSX.Element;
};

async function dump({ from, to, subject, body }: Params) {
  const { renderToStaticMarkup } = (await import("react-dom/server")).default;

  const data = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "",
    renderToStaticMarkup(body),
  ].join("\n");

  await writeFile(`./tmp/email-${Date.now()}.txt`, data, "utf8");
}

/**
 * Send an email. In development, it will dump the email to a file at `./tmp`.
 */
export async function send({
  from = defaultSender,
  to,
  subject,
  body,
}: Params) {
  if (process.env.NODE_ENV === "production") {
    await resend.emails.send({
      from,
      to,
      subject,
      react: body,
    });
  }

  await dump({ from, to, subject, body });
}
