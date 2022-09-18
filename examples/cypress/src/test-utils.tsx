import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { action, loader } from "./routes/contact";

export type CustomMountOptions = {
  path?: string;
  client?: QueryClient;
};

type TestMockData = {};

export function createTestQueryClient(mocks: TestMockData = {}) {
  let client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
      },
    },
  });

  client.invalidateQueries = cy.spy();

  return {
    client,
  };
}

type TextProviderProps = {
  client: QueryClient;
  children: React.ReactNode;
};

function TestOutlet() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export function TestProvider({ client, children }: TextProviderProps) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/contacts/hello"]}>
        <Routes location="/contacts/hello">
          <Route path="/" element={<TestOutlet />}>
            <Route
              path="contacts/:contactId"
              element={children}
              loader={loader(client)}
              action={action(client)}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
