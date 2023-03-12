import * as path from "path";
import mime from "mime";
import { Context } from "~/shared";

export const url = "/:path+";

export function handler(context: Context) {
  const file = path.join("static", context.url.pathname.input);
  const headers = {
    ["content-type"]:
      mime.getType(path.extname(file).slice(1)) ?? "application/octet-stream",
  };

  return { statusCode: 200, headers, body: file };
}
