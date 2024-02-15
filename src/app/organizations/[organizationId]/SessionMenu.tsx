"use client";

import { Menu } from "~/src/components/Menu";

type Props = {
  signIn: (sessionId: string) => void;
  signOut: () => void;
  sessions: { id: string; name: string }[];
};

export function SessionMenu({ signIn, signOut, sessions }: Props) {
  return (
    <Menu>
      {sessions.map((session) => (
        <Menu.Item key={session.id} onClick={() => signIn(session.id)}>
          {session.name}
        </Menu.Item>
      ))}
      <Menu.Item href="/sign-in">Sign in</Menu.Item>

      <Menu.Separator />

      <Menu.Item href="/profile">My profile</Menu.Item>
      <Menu.Item onClick={() => signOut()}>Sign out</Menu.Item>
    </Menu>
  );
}
