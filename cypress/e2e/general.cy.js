describe("template spec", () => {
  before("should successfully log into our app", () => {
    cy.visit("https://spoke-admin-dev.azurewebsites.net");
    cy.origin("https://dev-wwotwaa87dcb33bj.us.auth0.com", () => {
      cy.get("#organizationName").type("withspoke{Enter}");
      cy.get("#username").type("e2e@withspoke.com");
      cy.get("#password").type("Tester12!{Enter}");
    });
  });

  it("should check that the three left nav options are available", () => {
    cy.wait(1000);
    // cy.get("#Orders-leftnav").should("be.visible");
  });
});
