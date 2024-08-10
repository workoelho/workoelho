import { migrate as migrateOrganizations } from "~/src/feats/organizations/api";
import { migrate as migrateUsers } from "~/src/feats/users/api";

migrateOrganizations();
migrateUsers();
