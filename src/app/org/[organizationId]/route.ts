import { redirect } from "next/navigation";

export function GET(req: Request) {
  const url = new URL(req.url);
  return redirect(url.pathname + "/summary");
}
