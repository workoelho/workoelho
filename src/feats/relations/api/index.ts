import {
  Application,
  Prisma,
  Project,
  Provider,
} from "~/src/lib/server/prisma";
import { filterKeys } from "~/src/lib/shared/filterKeys";
import { mapObject } from "~/src/lib/shared/mapObject";
import { getPublicId, hasPrivateId, hasType } from "~/src/lib/shared/publicId";

export * from "./create";
export * from "./list";
export * from "./get";
export * from "./update";
export * from "./destroy";

type Relator = {
  application?: Application | null;
  project?: Project | null;
};

type Relatable = {
  application?: Application | null;
  provider?: Provider | null;
};

/**
 * Get a string representation for the given instance suited to work with form submission.
 */
export function getValue<T extends Relator | Relatable | undefined>(
  instance: T
) {
  if (!instance) {
    throw new Error(`Can't get value of ${JSON.stringify(instance)}`);
  }

  return JSON.stringify(
    mapObject(
      filterKeys(
        instance,
        (key, value) =>
          ["application", "provider", "project"].includes(String(key)) &&
          value !== null
      ),
      (key, value) => {
        if (hasType(value) && hasPrivateId(value)) {
          return [`${String(key)}Id`, getPublicId(value)];
        }
        throw new Error(`Can't get public ID of ${JSON.stringify(value)}`);
      }
    )
  );
}

/**
 * Parse the given value from a form submission.
 */
export function parseValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    throw new Error(`Can't parse value from ${JSON.stringify(value)}`);
  }

  return JSON.parse(value);
}
