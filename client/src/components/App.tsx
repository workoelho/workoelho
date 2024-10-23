import { Route, Switch } from "wouter";
import { Layout } from "~/src/components/Layout";

import { QueryClientProvider } from "~/src/components/QueryClientProvider";
import Dash from "~/src/routes/Dash";
import Join from "~/src/routes/Join";
import NotFound from "~/src/routes/NotFound";
import Privacy from "~/src/routes/Privacy";
import Sign from "~/src/routes/Sign";

export function App() {
  return (
    <QueryClientProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dash} />
          <Route path="/join" component={Join} />
          <Route path="/sign-in" component={Sign} />
          <Route path="/privacy" component={Privacy} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </QueryClientProvider>
  );
}
