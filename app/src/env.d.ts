import type { ClassList } from "~/src/lib/client/ClassList";

declare module "is-email" {
  export default function isEmail(value: string): boolean;
}
