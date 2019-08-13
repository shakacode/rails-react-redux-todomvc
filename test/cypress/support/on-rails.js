// CypressOnRails: dont remove these command
Cypress.Commands.add('appCommands', function (body) {
  cy.log("APP: " + JSON.stringify(body))
  cy.request({
    method: 'POST',
    url: "/__cypress__/command",
    body: JSON.stringify(body),
    log: true,
    failOnStatusCode: true
  })
});

Cypress.Commands.add('app', function (name, command_options) {
  cy.appCommands({ name: name, options: command_options })
});

Cypress.Commands.add('appScenario', function (name, options = {}) {
  cy.app('scenarios/' + name, options)
});

Cypress.Commands.add('appEval', function (code) {
  cy.app('eval', code)
});

Cypress.Commands.add('appFactories', function (options) {
  cy.app('factory_bot', options)
});

Cypress.Commands.add('appFixtures', function (options) {
  cy.app('activerecord_fixtures', options)
});
// CypressOnRails: end

// The next is optional
before(() => {
  cy.app('clean') // have a look at cypress/app_commands/clean.rb
});

// comment this out if you do not want to attempt to log additional info on test fail
Cypress.on('fail', (err, runnable) => {
  // allow app to generate additional logging data
  Cypress.$.ajax({
    url: '/__cypress__/command',
    data: JSON.stringify({ name: 'log_fail', options: { error_message: err.message, runnable_full_title: runnable.fullTitle() } }),
    async: false,
    method: 'POST'
  });

  throw err;
});