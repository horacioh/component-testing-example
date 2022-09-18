import { Contact as ContactType } from "../contacts";
import { createTestQueryClient } from "../test-utils";
import Contact from "./contact";

describe("Contact component", () => {
  it("should render", () => {
    let { client } = createTestQueryClient();

    client.setQueryData<ContactType>(["contacts", "detail", "hello"], {
      id: "hello",
      createdAt: 1660978712047,
      first: "demo",
      last: "test",
      favorite: false,
      avatar: "https://ui-avatars.com/api/?name=DEMO",
      notes: "test demo notes",
    });

    cy.mount(<Contact />, { client });
  });
});
