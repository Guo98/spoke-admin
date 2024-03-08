let orders_body = {};
let combined_orders = [];

const sortOrder = {
  Completed: 3,
  Complete: 3,
  Shipped: 2,
  Incomplete: 1,
};

const sortOrders = (a, b) => {
  if (sortOrder[a.shipping_status] < sortOrder[b.shipping_status]) return -1;
  if (sortOrder[a.shipping_status] > sortOrder[b.shipping_status]) return 1;

  if (a.orderNo > b.orderNo) return -1;
  if (a.orderNo < b.orderNo) return 1;
};

describe("Orders Page", { testIsolation: false }, () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.loginToAuth0(Cypress.env("auth_username"), Cypress.env("auth_password"));
    cy.intercept(
      "GET",
      "https://spoke-api-development.azurewebsites.net/orders/**"
    ).as("orders");
    cy.get("#Orders-leftnav").click();

    cy.wait("@orders").then((intercept) => {
      orders_body = intercept.response.body.data;
    });
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

    const order_info = orders_body.completed.filter(
      (order) => order.orderNo === 10540
    )[0];

    cy.get("#orders-recipient-name-0").should(
      "have.text",
      " " + order_info.full_name
    );

    cy.get("#orders-email-0").should("have.text", " " + order_info.email);

    cy.get("#orders-location-0").should(
      "have.text",
      " " + order_info.address.subdivision + ", " + order_info.address.country
    );
  });

  it("should check the items table", () => {
    const order_info = orders_body.completed.filter(
      (order) => order.orderNo === 10540
    )[0];
    cy.get("#orders-items-table").should("be.visible");
    cy.get("#orders-items-item-col")
      .should("be.visible")
      .should("have.text", "Item Name");
    cy.get("#orders-items-sn-col")
      .should("be.visible")
      .should("have.text", "Serial Number");
    cy.get("#orders-items-quantity-col")
      .should("be.visible")
      .should("have.text", "Quantity");
    cy.get("#orders-items-price-col")
      .should("be.visible")
      .should("have.text", "Price");
    cy.get("#orders-items-tracking-col")
      .should("be.visible")
      .should("have.text", "Tracking #");
    cy.get("#orders-items-status-col")
      .should("be.visible")
      .should("have.text", "Delivery Status");

    cy.get("#orders-items-table-body")
      .children()
      .should("have.lengthOf", order_info.items.length);
  });

  it("should check that device name is in the row", () => {
    const order_info = orders_body.completed.filter(
      (order) => order.orderNo === 10540
    )[0];

    const laptop_index = order_info.items.findIndex(
      (item) => item.type === "laptop"
    );

    if (laptop_index > -1) {
      cy.get("#orders-table-body")
        .find("tr")
        .eq(0)
        .children()
        .eq(4)
        .should("have.text", order_info.items[laptop_index].name);
    }
  });

  it("should be correctly sorted by order number and order status", () => {
    combined_orders = [...orders_body.in_progress, ...orders_body.completed];

    combined_orders = combined_orders.sort(sortOrders);

    combined_orders.forEach((order, index) => {
      cy.get("#orders-table-body")
        .children()
        .eq(index * 2)
        .children()
        .eq(1)
        .should("have.text", order.orderNo);
    });
  });

  it("should check the deployment tab", () => {
    cy.get("#orders-deployments")
      .should("be.visible")
      .should("have.text", "Deployments")
      .click();

    const deployment_orders = combined_orders.filter(
      (order) => order.items.filter((item) => item.type === "laptop").length > 0
    );

    cy.get("#orders-table-body")
      .children()
      .should("have.lengthOf", deployment_orders.length * 2);
  });

  it("should check the returns tab", () => {
    cy.get("#orders-returns")
      .should("be.visible")
      .should("have.text", "Returns")
      .click();

    const return_orders = combined_orders.filter(
      (order) =>
        order.items.filter(
          (item) => item.name === "Offboarding" || item.name === "Returning"
        ).length > 0
    );
    if (return_orders.length === 0) {
      cy.get("#orders-table-body").should("not.exist");
    } else {
      cy.get("#orders-table-body")
        .children()
        .should("have.lengthOf", return_orders.length * 2);
    }
  });

  it("should test the search functionality", () => {
    cy.get("#search-bar").should("be.visible").type("10520{Enter}");
    cy.get("#orders-all").should("have.attr", "aria-selected", "true");

    const filtered_orders = combined_orders.filter(
      (order) => order.orderNo === 10520
    );

    if (filtered_orders.length === 0) {
      cy.get("#orders-table-body").should("not.exist");
    } else {
      cy.get("#orders-table-body")
        .children()
        .should("have.lengthOf", filtered_orders.length * 2);
    }

    cy.get("#clear-button").should("be.visible").click();
    cy.get("#orders-table-body")
      .children()
      .should("have.lengthOf", combined_orders.length * 2);
  });
  // test searching orders page
});
