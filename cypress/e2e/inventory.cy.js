let inventory_obj = [];
let sorted_by_stock = [];
let in_stock_total = 0;
let in_stock_serials = [];

describe("Inventory Page", { testIsolation: false }, () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.loginToAuth0(Cypress.env("auth_username"), Cypress.env("auth_password"));
    cy.intercept(
      "GET",
      "https://spoke-api-development.azurewebsites.net/inventory/**"
    ).as("inventory");
    cy.get("#Inventory-leftnav").click();

    cy.wait("@inventory").then((intercept) => {
      inventory_obj = intercept.response.body.data;

      sorted_by_stock = inventory_obj.sort(
        (a, b) =>
          a.serial_numbers.filter((sn) => sn.status === "In Stock").length >
          b.serial_numbers.filter((sn) => sn.status === "In Stock").length
      );
    });
  });

  it("should check for Inventory header text and download inventory button", () => {
    cy.get("#inventory-header")
      .should("be.visible")
      .should("have.text", "Inventory ");
    cy.get("#inventory-export-button").should("be.visible");
  });

  it("should check the inventory tabs", () => {
    const eol_devices = inventory_obj.filter(
      (device) =>
        device.serial_numbers.length > 0 &&
        device.serial_numbers.filter((sn) => sn.condition === "End of Life")
          .length > 0
    );

    cy.get("#inv-tab-0")
      .should("be.visible")
      .should("have.text", "In Stock")
      .should("have.attr", "aria-selected", "true");

    cy.get("#inv-tab-1")
      .should("be.visible")
      .should("have.text", "Deployed")
      .should("have.attr", "aria-selected", "false");

    cy.get("#inv-tab-2")
      .should("be.visible")
      .should("have.text", "Pending")
      .should("have.attr", "aria-selected", "false");

    if (eol_devices.length > 0) {
      cy.get("#inv-tab-3")
        .should("be.visible")
        .should("have.text", "End of Life")
        .should("have.attr", "aria-selected", "false");
    }
  });

  it("should check the first available device in stock [accordion summary]", () => {
    in_stock_serials = sorted_by_stock[0].serial_numbers.filter(
      (sn) => sn.status === "In Stock" && sn.condition !== "End of Life"
    );
    in_stock_total = in_stock_serials.length;
    cy.get("#inventory-accordionsummary-0")
      .should("exist")
      .should("have.attr", "aria-expanded", "false");
    cy.get("#inventory-summary-name-0")
      .should("be.visible")
      .should("have.text", sorted_by_stock[0].name);
    if (sorted_by_stock[0].specs.screen_size) {
      cy.get("#inventory-summary-screen-0")
        .should("be.visible")
        .should("have.text", sorted_by_stock[0].specs.screen_size);
    }
    if (sorted_by_stock[0].specs.cpu) {
      cy.get("#inventory-summary-cpu-0")
        .should("be.visible")
        .should("have.text", sorted_by_stock[0].specs.cpu);
    }
    if (sorted_by_stock[0].specs.ram) {
      cy.get("#inventory-summary-ram-0")
        .should("be.visible")
        .should("have.text", sorted_by_stock[0].specs.ram);
    }
    if (sorted_by_stock[0].specs.hard_drive) {
      cy.get("#inventory-summary-ssd-0")
        .should("be.visible")
        .should("have.text", sorted_by_stock[0].specs.hard_drive);
    }
    cy.get("#inventory-summary-stock-0")
      .should("be.visible")
      .contains("span", in_stock_total);
  });

  it("should open up the accordion", () => {
    cy.get("#inventory-accordiondetails-0").should("not.visible");
    cy.get("#inventory-accordionsummary-0").click();
    cy.get("#inventory-accordiondetails-0").should("be.visible");
    cy.get("#in-stock-devices-table").should("be.visible");
    cy.get("#in-stock-devices-table-body")
      .find("tr")
      .should("have.lengthOf", in_stock_total);
  });

  it("should check the table body", () => {
    const asc_sorted_serials = in_stock_serials.sort((a, b) =>
      a.sn > b.sn ? 1 : b.sn > a.sn ? -1 : 0
    );

    asc_sorted_serials.forEach((serial, index) => {
      cy.get("#in-stock-devices-table-body")
        .find("tr")
        .eq(index)
        .find("p")
        .eq(0)
        .should("have.text", serial.sn);

      cy.get("#in-stock-devices-table-body")
        .find("tr")
        .eq(index)
        .find("p")
        .eq(1)
        .should("have.text", serial.condition);

      if (serial.grade) {
        cy.get("#in-stock-devices-table-body")
          .find("tr")
          .eq(index)
          .find("p")
          .eq(2)
          .should("have.text", serial.grade);
      }

      if (serial.warehouse) {
        cy.get("#in-stock-devices-table-body")
          .find("tr")
          .eq(index)
          .find("p")
          .eq(3)
          .should("have.text", serial.warehouse);
      }

      cy.get("#in-stock-devices-table-body")
        .find("tr")
        .eq(index)
        .find("button")
        .eq(0)
        .should("have.text", "Assign");
    });
  });

  it("should check the first assign button/modal", () => {
    cy.get("#assign-modal").should("not.exist");
    cy.get("#in-stock-devices-table-body")
      .find("tr")
      .eq(0)
      .find("button")
      .eq(0)
      .should("have.text", "Assign")
      .click();

    cy.get("#assign-modal").should("be.visible");

    cy.get("#assign-stepper")
      .should("be.visible")
      .children()
      .should("have.lengthOf", 5);

    cy.get("#assign-modal-device-name").should(
      "have.text",
      sorted_by_stock[0].name
    );
    cy.get("#assign-modal-sn").should("have.text", in_stock_serials[0].sn);

    cy.get("#assign-modal-buttons-row")
      .should("be.visible")
      .find("button")
      .eq(0)
      .should("have.text", "Add Accessories");
    cy.get("#assign-modal-buttons-row")
      .should("be.visible")
      .find("button")
      .eq(1)
      .should("have.text", "Deploy");
  });

  it("should test the add accessories flow", () => {
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("not.have.class", "Mui-completed");
    cy.get("#assign-modal-buttons-row")
      .should("be.visible")
      .find("button")
      .eq(0)
      .click();
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("have.class", "Mui-completed");
    cy.get("#accessories-stack").should("be.visible");
    cy.get("#return-checkbox")
      .should("be.visible")
      .should("have.text", "Include Return Box");

    cy.get("#assign-stepper")
      .children()
      .eq(4)
      .find("span")
      .should("not.have.class", "Mui-completed");
    cy.get("#accessories-stack").find("button").click();
    cy.get("#assign-stepper")
      .children()
      .eq(4)
      .find("span")
      .should("have.class", "Mui-completed");

    cy.get("#assign-modal-recipient-form").should("be.visible");

    cy.get("#assign-modal-back").click({ force: true });
    cy.get("#assign-stepper")
      .children()
      .eq(4)
      .find("span")
      .should("not.have.class", "Mui-completed");
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("have.class", "Mui-completed");

    cy.get("#assign-modal-back").click({ force: true });
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("not.have.class", "Mui-completed");
  });

  it("should test the deploy flow", () => {
    cy.get("#assign-modal-buttons-row")
      .should("be.visible")
      .find("button")
      .eq(1)
      .click();
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("not.have.class", "Mui-completed");
    cy.get("#assign-stepper")
      .children()
      .eq(4)
      .find("span")
      .should("have.class", "Mui-completed");

    cy.get("#assign-modal-back").click({ force: true });
    cy.get("#assign-stepper")
      .children()
      .eq(2)
      .find("span")
      .should("not.have.class", "Mui-completed");
    cy.get("#assign-stepper")
      .children()
      .eq(4)
      .find("span")
      .should("not.have.class", "Mui-completed");

    cy.get("body").click(0, 0);
  });

  it("should test the search functionality", () => {
    cy.get("#search-bar").should("be.visible").type("macbook{Enter}");

    cy.get("#inventory-root-stack")
      .children()
      .each(($el, index) => {
        cy.get("#inventory-summary-name-" + index).contains("p", "MacBook");
      });

    cy.get("#clear-button").should("be.visible").click();

    cy.get("#inventory-root-stack")
      .children()
      .should("have.lengthOf", sorted_by_stock.length);
  });

  it("should check the manage button [verify has 3 buttons]", () => {
    cy.get("#inventory-manage-button").should("be.visible").click();

    cy.get("#inventory-manage-actions-row").should("be.visible");

    cy.get("#inventory-manage-actions-row")
      .children()
      .should("have.lengthOf", 3);
  });

  it("should check the manage button [assign flow]", () => {
    cy.get("#assign-modal").should("not.exist");
    cy.get("#inventory-manage-assign").should("be.visible").click();

    cy.get("#assign-modal").should("exist");
    cy.get("#manage-assign-dropdown").should("be.visible");

    cy.get("#manage-select-device").click();

    sorted_by_stock.forEach((device, index) => {
      if (device.serial_numbers.filter((sn) => sn.status === "In Stock") > 0) {
        cy.get('ul[role="listbox"]')
          .find("li")
          .eq(index)
          .should("have.text", device.name + "," + device.location);
      }
    });

    cy.get('ul[role="listbox"]').find("li").eq(3).click();

    cy.get("#assign-modal-buttons-row")
      .should("be.visible")
      .find("button")
      .eq(1)
      .click();

    cy.get("#assign-modal-recipient-form").should("be.visible");
    cy.get("#assign-recipient-form-device-name").should(
      "have.text",
      sorted_by_stock[3].name
    );
    cy.get("#assign-recipient-form-sn").should(
      "have.text",
      sorted_by_stock[3].serial_numbers.filter(
        (sn) => sn.status === "In Stock"
      )[0].sn
    );

    cy.get("body").click(0, 0);
    cy.get("body").click(0, 0);
  });

  it("should check the manage button [return flow]", () => {
    cy.get("#inventory-manage-button").should("be.visible").click();

    cy.get("#inventory-manage-return").should("be.visible").click();

    cy.get("#return-modal-header")
      .should("be.visible")
      .should("have.text", "Return a Device");

    cy.get("#return-modal-select-type").should("be.visible").click();

    ["Offboarding", "Returning"].forEach((val, index) => {
      cy.get('ul[role="listbox"]')
        .find("li")
        .eq(index)
        .should("have.text", val);
    });

    cy.get('ul[role="listbox"]').find("li").eq(1).click();
    cy.get("#return-modal-submit").should("be.disabled");
    cy.get("#return-modal-fn").type("John");
    cy.get("#return-modal-ln").type("Doe");
    cy.get("#return-modal-email").type("johndoe@email.com");
    cy.get("#return-modal-submit").should("not.be.disabled");

    cy.get("body").click(0, 0);
    cy.get("body").click(0, 0);
  });

  it("should check the manage button [buy flow]", () => {
    cy.get("#inventory-manage-button").should("be.visible").click();

    cy.get("#inventory-manage-buy").should("be.visible").click();

    cy.url().should("include", "/marketplace");
  });
});
