describe("Left Nav", { testIsolation: false }, () => {
  before(() => {
    cy.visit("http://localhost:3000");

    cy.loginToAuth0(Cypress.env("auth_username"), Cypress.env("auth_password"));
  });

  it("should check that the left nav options are available", () => {
    cy.get("#Orders-leftnav").should("be.visible");
    cy.get("#Inventory-leftnav").should("be.visible");
    cy.get("#Storefront-leftnav").should("be.visible");
    cy.get("#Marketplace-leftnav").should("be.visible");
    cy.get("#Approvals-leftnav").should("be.visible");
    cy.get("#Invite-leftnav").should("be.visible");
  });

  it("should test that the profile contains the name e2e", () => {
    cy.contains("Welcome, e2e");
  });

  it("should check the bottom left nav options", () => {
    cy.get("#Support-leftnav").should("be.visible");
    cy.get("#Roadmap-leftnav").should("be.visible");
    cy.get("#Logout-leftnav").should("be.visible");
  });
});
