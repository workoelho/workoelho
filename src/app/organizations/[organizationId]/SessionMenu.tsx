"use client";

import Link from "next/link";

import { Menu, Option, Separator } from "~/src/components/Menu";

type Props = {
  signIn: (sessionId: string) => void;
  signOut: () => void;
  sessions: { id: string; name: string }[];
};

export function SessionMenu({ signIn, signOut, sessions }: Props) {
  return (
    <Menu>
      {sessions.map((session) => (
        <Option key={session.id} onClick={() => signIn(session.id)}>
          {session.name}
        </Option>
      ))}
      <Option as={Link} href="/sign-in">
        Sign in
      </Option>

      <Separator />

      <Option as={Link} href="/profile">
        My profile
      </Option>
      <Option onClick={() => signOut()}>Sign out</Option>
    </Menu>
  );
}
