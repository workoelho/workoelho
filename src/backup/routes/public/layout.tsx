import type { ReactNode } from "react";

import { Layout as Parent } from "~/src/routes/layout";

type Props = {
	title?: string;
	children: ReactNode;
};

export function Layout({ title, children }: Props) {
	return (
		<Parent title={title}>
			<nav className="stack">
				<h1 className="title">
					<a href="/">Workoelho</a>
				</h1>

				<ul>
					<li>
						<a href="/sessions/new">Sign in</a>
					</li>
					<li>
						<a href="/organizations/new">Sign up</a>
					</li>
				</ul>
			</nav>

			{children}
		</Parent>
	);
}
