let marketplace_obj = [];

describe("Marketplace Page", () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.loginToAuth0(Cypress.env("auth_username"), Cypress.env("auth_password"));
    cy.intercept(
      "GET",
      "https://spoke-api-development.azurewebsites.net/getmarketplaceinventory/**"
    ).as("marketplace");
    cy.get("#Marketplace-leftnav").click();

    cy.wait("@marketplace").then((intercept) => {
      marketplace_obj = intercept.response.body.data;
    });
  });
});
