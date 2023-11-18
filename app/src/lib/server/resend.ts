import Resend from "resend";

declare const global: { resend: Resend };

export const resend = global.resend ?? new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  global.resend = resend;
}

export default resend;
