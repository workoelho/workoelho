import { redirect } from "next/navigation";

import { getUrl } from "~/src/lib/shared/url";

export function GET() {
  return redirect(getUrl("sign-in"));
}
