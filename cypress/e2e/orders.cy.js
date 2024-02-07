describe("Orders Page", { testIsolation: false }, () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.loginToAuth0(Cypress.env("auth_username"), Cypress.env("auth_password"));
    cy.intercept(
      "GET",
      "https://spoke-api-development.azurewebsites.net/orders/**"
    ).as("orders");
    cy.get("#Orders-leftnav").click();

    cy.wait("@orders");
  });

  it("should check for Orders header text and download orders button", () => {
    cy.get("#orders-header").should("be.visible");
    cy.get("#export-orders-button").should("be.visible");
  });

  it("should check for 3 tabs", () => {
    cy.get("#orders-all").should("be.visible");
    cy.get("#orders-deployments").should("be.visible");
    cy.get("#orders-returns").should("be.visible");
  });

  it("should check the table is there with correct columns", () => {
    cy.get("#orders-table-container").should("be.visible");
    cy.get("#orders-collapsible-col").should("be.visible");
    cy.get("#orders-number-col")
      .should("be.visible")
      .contains("th", "Order Number");
    cy.get("#orders-date-col")
      .should("be.visible")
      .contains("th", "Order Date");
    cy.get("#orders-name-col")
      .should("be.visible")
      .contains("th", "Recipient Name");
    cy.get("#orders-type-col")
      .should("be.visible")
      .contains("th", "Device Type");
    cy.get("#orders-price-col").should("be.visible").contains("th", "Price");
    cy.get("#orders-status-col").should("be.visible").contains("th", "Status");
    cy.get("#orders-table-header-row").find("th").should("have.lengthOf", 7);
  });

  it("should check the number of table rows and count", () => {
    cy.get("#orders-table-body").find("tr").should("have.lengthOf", 16);
    cy.get("#orders-count").should("be.visible").contains("8");
    cy.get("#show-more").should("be.disabled");
  });

  it("should expand the first row", () => {
    cy.get("#hidden-row-0")
      .find("td")
      .eq(0)
      .children()
      .should("have.length", 0);
    cy.get("#orders-table-body").find("tr").eq(0).find("td").eq(0).click();
  });

  it("should check employee info section", () => {
    cy.get("#hidden-row-0")
      .find("td")
      .eq(0)
      .children()
      .should("have.length.greaterThan", 0);
  });
});
