// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

// -- This is a parent command --
Cypress.Commands.add("login", (overrides = {}) => {
  Cypress.log({
    name: "loginViaAuth0",
  });

  const options = {
    method: "POST",
    url: Cypress.env("auth_url"),
    body: {
      grant_type: "client_credentials",
      // username: Cypress.env("auth_username"),
      //password: Cypress.env("auth_password"),
      audience: Cypress.env("auth_audience"),
      //scope: "openid profile email",
      client_id: Cypress.env("auth_client_id"),
      client_secret: Cypress.env("auth_client_secret"),
    },
  };

  cy.request(options);
});

function loginViaAuth0Ui(username, password) {
  //cy.visit("/");

  cy.get("body").then(($body) => {
    if ($body.find("#login-button").length > 0) {
      cy.get("#login-button").click();
      cy.origin(
        Cypress.env("auth_domain"),
        { args: { username, password } },
        ({ username, password }) => {
          // check if url is equal to localhost

          cy.get("#organizationName")
            .should("exist")
            .then(($el) => {
              if ($el) {
                cy.get("#organizationName").type("withspoke{Enter}");
                cy.get("input#username").type(username + "{Enter}");
                cy.get("input#password").type(password, { log: false });
                cy.contains("button[value=default]", "Continue").click();
              }
            });
        }
      );
    }
  });
}

Cypress.Commands.add("loginToAuth0", (username, password) => {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaAuth0Ui(username, password);

  log.snapshot("after");
  log.end();
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
