describe("template spec", { testIsolation: false }, () => {
  before(() => {
    // cy.visit("https://spoke-admin-dev.azurewebsites.net");
    // cy.url().then(($url) => {
    //   if ($url.includes("dev-wwotwaa87dcb33bj.us.auth0.com")) {
    //     cy.origin("https://dev-wwotwaa87dcb33bj.us.auth0.com", () => {
    //       cy.get("#organizationName").type("withspoke{Enter}");
    //       cy.get("#username").type("e2e@withspoke.com");
    //       cy.get("#password").type("Tester12!{Enter}");
    //     });
    //   }
    // });
    cy.login()
      .then((resp) => {
        return resp.body;
      })
      .then((body) => {
        const { access_token, expires_in, id_token } = body;
        const auth0State = {
          nonce: "",
          state: "some-random-state",
        };
        const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        cy.visit(callbackUrl, {
          onBeforeLoad(win) {
            win.document.cookie =
              "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
          },
        });
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

    it("should test that the export button is there", () => {
      cy.get("#export-orders-button").should("be.visible");
    });

    it("should open the first accordion on orders", () => {
      cy.get("#order-accordionsummary-0").contains("Order #10540").click();
    });

    it("should check the search label", () => {
      cy.get("#header-searchbar-label").contains(
        "Search Orders by order number, name, item, location"
      );
    });
  });

  describe("test inventory page", () => {
    it("should click on the inventory button", () => {
      cy.get("#Inventory-leftnav").click();
    });

    it("should test that the three tabs are there", () => {
      cy.get("#inv-tab-0").should("be.visible");
      cy.get("#inv-tab-1").should("be.visible");
      cy.get("#inv-tab-2").should("be.visible");
    });

    it("should test that the export button is there", () => {
      cy.get("#inventory-export-button").should("be.visible");
    });

    it("should check the search label", () => {
      cy.get("#header-searchbar-label").contains(
        "Search Inventory by device name, serial number, location, employee name"
      );
    });

    it("should open the first accordion on inventory", () => {
      cy.get("#inventory-accordionsummary-0")
        .contains("Razer Blade 14")
        .click();
    });
  });
});
