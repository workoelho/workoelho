import { Session } from "@prisma/client";
import { Issue } from "~/lib/shared/InvalidInput";
import { POST } from "~/app/api/sessions/route";
import { Form } from "./form";
import { redirect } from "next/navigation";

export default function Page() {
  const action = async (payload: FormData) => {
    "use server";

    const response = await POST(
      new Request("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.get("email"),
          password: payload.get("password"),
        }),
      })
    );

    if (response.status === 422) {
      return (await response.json()) as Issue[];
    } else if (response.status < 300) {
      redirect("/");
    }
  };

  return (
    <main>
      <Form action={action} />
    </main>
  );
}
