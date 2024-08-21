// cypress/integration/app.spec.js
describe("App", () => {
  it("tictactoe grid", () => {
    // Make sure your app is running on this port
    cy.visit("http://localhost:3000");
    cy.contains("Current Player: X");
  });
});
