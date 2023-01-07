describe("test the home screen", () => {
  beforeEach(() => {
      cy.visit("http://localhost:3000");
  });
  it("successfully loads", () => {
     cy.get('[class="mantine-Text-root mantine-hi380w"]').should("contain", "Hike Tracker");
     cy.get('[class="mantine-qo1k2 mantine-Button-label"]').should("contain", "Browse Hikes");
     //cy.get('[class="mantine-qo1k2 mantine-Button-label"]').should("contain", "Login");
     //cy.get('[class="mantine-qo1k2 mantine-Button-label"]').should("contain", "Sign Up");
  });
});


describe("test login", () => {
  beforeEach(() => {
      cy.visit("http://localhost:3000/login");
  });
  it("right elemen loads", () => {
    cy.get('h1').should("contain", "Welcome back!");
  });
});


