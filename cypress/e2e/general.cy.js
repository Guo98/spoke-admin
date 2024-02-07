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

  // describe("test orders page", () => {
  //   it("should test that the three tabs are there", () => {
  //     cy.get("#orders-tab-0").should("be.visible");
  //     cy.get("#orders-tab-1").should("be.visible");
  //     cy.get("#orders-tab-2").should("be.visible");
  //   });

  //   it("should test that the export button is there", () => {
  //     cy.get("#export-orders-button").should("be.visible");
  //   });

  //   it("should open the first accordion on orders", () => {
  //     cy.get("#order-accordionsummary-0").contains("Order #10540").click();
  //   });

  //   it("should check the search label", () => {
  //     cy.get("#header-searchbar-label").contains(
  //       "Search Orders by order number, name, item, location"
  //     );
  //   });
  // });

  // describe("test inventory page", () => {
  //   it("should click on the inventory button", () => {
  //     cy.get("#Inventory-leftnav").click();
  //   });

  //   it("should test that the three tabs are there", () => {
  //     cy.get("#inv-tab-0").should("be.visible");
  //     cy.get("#inv-tab-1").should("be.visible");
  //     cy.get("#inv-tab-2").should("be.visible");
  //   });

  //   it("should test that the export button is there", () => {
  //     cy.get("#inventory-export-button").should("be.visible");
  //   });

  //   it("should check the search label", () => {
  //     cy.get("#header-searchbar-label").contains(
  //       "Search Inventory by device name, serial number, location, employee name"
  //     );
  //   });

  //   it("should open the first accordion on inventory", () => {
  //     cy.get("#inventory-accordionsummary-0")
  //       .contains("Razer Blade 14")
  //       .click();
  //   });
  // });
});
