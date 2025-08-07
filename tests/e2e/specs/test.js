// https://docs.cypress.io/api/table-of-contents

describe("Demo test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Horse Racing");
  });
});
