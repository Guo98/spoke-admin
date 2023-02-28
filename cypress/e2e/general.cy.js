describe("template spec", { testIsolation: false }, () => {
  before(() => {
    cy.visit("https://spoke-admin-dev.azurewebsites.net");
    cy.url().then(($url) => {
      if ($url.includes("dev-wwotwaa87dcb33bj.us.auth0.com")) {
        cy.origin("https://dev-wwotwaa87dcb33bj.us.auth0.com", () => {
          cy.get("#organizationName").type("withspoke{Enter}");
          cy.get("#username").type("e2e@withspoke.com");
          cy.get("#password").type("Tester12!{Enter}");
        });
      }
    });
  });

  it("should check that the three left nav options are available", () => {
    cy.get("#Orders-leftnav").should("be.visible");
    cy.get("#Inventory-leftnav").should("be.visible");
    cy.get("#Storefront-leftnav").should("be.visible");
  });

  it("should test that the profile contains the name e2e", () => {
    cy.contains("Welcome, e2e");
  });

  describe("test orders page", () => {
    it("should test that the three tabs are there", () => {
      cy.get("#orders-tab-0").should("be.visible");
      cy.get("#orders-tab-1").should("be.visible");
      cy.get("#orders-tab-2").should("be.visible");
    });
    it("should test that the export button is there", () => {});
  });
});
