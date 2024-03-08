let marketplace_obj = [];
let specs_obj = {};

describe("Marketplace Page", { testIsolation: false }, () => {
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

  it("should check the marketplace header", () => {
    cy.get("#marketplace-header")
      .should("be.visible")
      .should("have.text", "Marketplace");

    cy.get("#marketplace-add-new")
      .should("be.visible")
      .should("have.text", "Add New Device");
  });

  it("should check that each item type has a card", () => {
    marketplace_obj.forEach((obj) => {
      cy.get("#" + obj.item_type + "-card")
        .should("be.visible")
        .should("have.text", obj.item_type);
    });
  });

  it("should click into the laptops card and check the brands", () => {
    cy.get("#Laptops-card").should("exist").click({ force: true });
    marketplace_obj[0].brands.forEach((brand) => {
      cy.get("#" + brand.brand + "-card").should("exist");
    });

    cy.get("#Others-card").should("exist");
  });

  it("should click the Apple brand and see the available options", () => {
    cy.get("#Apple-card").should("be.visible").click();
    cy.get("#marketplace-purchase-modal").should("be.visible");

    cy.get("#marketplace-purchase-modal-header")
      .should("be.visible")
      .contains("Apple");

    cy.get("#type-select").should("be.visible").click();

    const apple_index = marketplace_obj[0].brands.findIndex(
      (b) => b.brand === "Apple"
    );

    marketplace_obj[0].brands[apple_index].types.forEach((t, index) => {
      cy.get('ul[role="listbox"]')
        .find("li")
        .eq(index)
        .should("have.text", t.type);
    });

    // click macbook pro
    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(0)
      .should("have.text", "MacBook Pro")
      .click();
    cy.get("#bookmark-button").should("be.disabled");
    cy.get("#delete-specs-button").should("be.disabled");
    const mb_pro_index = marketplace_obj[0].brands[apple_index].types.findIndex(
      (t) => t.type === "MacBook Pro"
    );

    cy.get("#specs-select").should("be.visible").click();

    marketplace_obj[0].brands[apple_index].types[mb_pro_index].specs.forEach(
      (s, index) => {
        cy.get('ul[role="listbox"]')
          .find("li")
          .eq(index)
          .should("have.text", s.spec);
      }
    );

    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(
        marketplace_obj[0].brands[apple_index].types[mb_pro_index].specs.length
      )
      .should("have.text", "Different Specs");

    cy.get('ul[role="listbox"]').find("li").eq(0).click();

    cy.get("#bookmark-button").should("not.be.disabled");
    cy.get("#delete-specs-button").should("not.be.disabled");
    cy.get("#color-select").should("be.visible").click();

    marketplace_obj[0].brands[apple_index].types[mb_pro_index].colors.forEach(
      (c, index) => {
        cy.get('ul[role="listbox"]')
          .find("li")
          .eq(index)
          .should("have.text", c);
      }
    );

    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(0)
      .should("have.text", "Space Gray")
      .click();

    cy.get("#region-select").should("be.visible").click();
    marketplace_obj[0].brands[apple_index].types[
      mb_pro_index
    ].specs[0].locations.forEach((l, index) => {
      cy.get('ul[role="listbox"]').find("li").eq(index).should("have.text", l);
    });

    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(
        marketplace_obj[0].brands[apple_index].types[mb_pro_index].specs[0]
          .locations.length
      )
      .should("have.text", "Different Region");

    cy.get('ul[role="listbox"]').find("li").eq(0).click();

    cy.get("#marketplace-purchase-modal-check-stock").should("be.visible");
    cy.get("#marketplace-purchase-modal-add-accessories").should("be.visible");
    cy.get("#marketplace-purchase-modal-request-quote").should("be.visible");
  });

  it("should check the add [Accessories] flow", () => {
    cy.get("#marketplace-purchase-modal-add-accessories")
      .should("be.visible")
      .click();
    cy.get("#accessories-stack").should("be.visible");
    cy.get("#accessories-continue").should("be.visible").click();

    cy.get("#deployment-select").should("be.visible").click();

    ["Drop Ship", "Buy and Hold"].forEach((d, index) => {
      cy.get('ul[role="listbox"]').find("li").eq(index).should("have.text", d);
    });
  });

  it("should check the [Drop Ship] option", () => {
    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(0)
      .should("have.text", "Drop Ship")
      .click();

    cy.get("#recipient-stack").should("be.visible");

    cy.get("#marketplace-purchase-modal").scrollTo("bottom");
    cy.get("#marketplace-modal-request-button")
      .should("be.visible")
      .should("be.disabled");
    cy.get("#marketplace-purchase-modal").scrollTo("center");

    cy.get("#rf-fn").should("be.visible").type("John");
    cy.get("#rf-ln").should("be.visible").type("Doe");
    cy.get("#rf-email").should("be.visible").type("random@gmail.com");
    cy.get("#rf-pnum").should("be.visible").type("1234567890");
    cy.get("#rf-ad1").should("be.visible").type("100 Main St");
    cy.get("#rf-city").should("be.visible").type("City");
    cy.get("#rf-state").should("be.visible").type("State");
    cy.get("#rf-country").should("be.visible").should("have.value", "US");
    cy.get("#rf-pc").should("be.visible").type("01234");

    cy.get("#marketplace-purchase-modal").scrollTo("bottom");

    cy.get("#rf-shipping-select").should("be.visible").click();
    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(2)
      .should("have.text", "Overnight")
      .click();

    cy.get("#marketplace-modal-request-button")
      .should("be.visible")
      .should("be.disabled");

    cy.get("#marketplace-modal-checkbox").check();

    cy.get("#marketplace-modal-request-button")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("should check the [Buy and Hold] option", () => {
    cy.get("#marketplace-purchase-modal").scrollTo("top");

    cy.get("#deployment-select").should("be.visible").click();
    cy.get('ul[role="listbox"]')
      .find("li")
      .eq(1)
      .should("have.text", "Buy and Hold")
      .click();

    cy.get("#marketplace-modal-bh-stack").should("be.visible");

    cy.get("#marketplace-modal-request-button")
      .should("be.visible")
      .should("be.disabled");

    cy.get("#marketplace-modal-checkbox").should("not.be.checked").check();

    cy.get("#marketplace-modal-request-button")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("should clear everything with the clear button", () => {
    cy.get("#marketplace-purchase-modal").scrollTo("top");
    cy.get("#clear-button").should("be.visible").click();
    cy.get("#marketplace-purchase-device-selection-stack").should("be.visible");

    cy.get("body").click(0, 0);
  });

  it("should check the [Add New Device] button", () => {
    cy.get("#marketplace-add-new").should("be.visible").click();
    cy.get("#add-new-device-box").should("be.visible");
    cy.get("#add-new-device-header")
      .should("be.visible")
      .should("have.text", "Add New Standard Device");
    cy.get("#supplier-text-input").should("be.visible");
    cy.get("#add-new-device-next-button")
      .should("be.visible")
      .should("be.disabled");

    cy.get("#supplier-text-input").type("www.dummy.com");
    cy.get("#supplier-text-input-helper-text")
      .should("be.visible")
      .should("have.text", "Only CDW and Insight links supported right now.");
    cy.get("#add-new-device-next-button").should("be.disabled");

    cy.get("#supplier-text-input").clear();
    cy.get("#supplier-text-input").type(
      "https://www.cdw.com/product/apple-macbook-pro-14-m3-16-gb-ram-512-gb-ssd-space-gray/7667608?pfm=srh"
    );

    cy.intercept(
      "POST",
      "https://spoke-api-development.azurewebsites.net/marketplace/specs"
    ).as("specs");

    cy.get("#add-new-device-next-button").should("not.be.disabled").click();

    cy.wait("@specs").then((intercept) => {
      specs_obj = intercept.response.body.data;
    });

    cy.get("#confirm-specs-stack").should("be.visible");
  });

  it("should check the confirm specs modal page", () => {
    cy.get("#confirm-specs-details-stack").should("be.visible");

    // cy.get("#confirm-specs-product-name").contains(specs_obj.name);
    cy.get("#confirm-specs-supplier").contains(specs_obj.supplier);
    cy.get("#confirm-specs-stock-level").contains(specs_obj.stock_level);
    cy.get("#confirm-specs-est-price").contains(specs_obj.price);

    cy.get("#add-new-device-box").scrollTo("bottom");
    cy.get("#confirm-specs-text-product-name").should(
      "have.value",
      specs_obj.name
    );

    if (
      specs_obj.device_type === "laptops" ||
      specs_obj.device_type === "desktops"
    ) {
      cy.get("#confirm-specs-device-details-stack").should("be.visible");
      if (specs_obj.screen_size) {
        cy.get("#confirm-specs-text-screen").should(
          "has.value",
          specs_obj.screen_size
        );
      }

      if (specs_obj.cpu) {
        cy.get("#confirm-specs-text-cpu").should("has.value", specs_obj.cpu);
      }

      if (specs_obj.ram) {
        cy.get("#confirm-specs-text-ram").should("has.value", specs_obj.ram);
      }

      if (specs_obj.hard_drive) {
        cy.get("#confirm-specs-text-ssd").should(
          "has.value",
          specs_obj.hard_drive
        );
      }

      if (specs_obj.color) {
        cy.get("#confirm-specs-text-color").should(
          "has.value",
          specs_obj.color
        );
      }
    }

    cy.get("#confirm-specs-text-location").should(
      "have.value",
      "United States"
    );

    cy.get("#confirm-specs-add-button").should("be.visible");

    cy.get("body").click(0, 0);
  });
});
