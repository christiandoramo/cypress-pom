import loginPage from "../../../pages/LoginPage"
import homePage from "../../../pages/HomePage"

const email = Cypress.env('email')
const password = Cypress.env('password')

describe('Logout', () => {
  before("Logar previamente",() => {
    loginPage.visit();
    loginPage.elements.inputEmail().type(email);
    loginPage.elements.inputPassword().type(password);
    loginPage.elements.submitButton().click();
    cy.url().should('include', homePage.urlAcron);
  })

  it('Deve fazer logout com sucesso',() => {
    cy.wait(2000)
    homePage.elements.profileButton().should('be.visible').click();
    cy.wait(500)
    homePage.elements.logoutButton().should('be.visible').click();
    cy.url().should('include', loginPage.signOutUrlAcron); // Substitua '/dashboard' pela URL esperada após o login
  });
});