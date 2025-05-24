import loginPage from "../../../pages/LoginPage"
import homePage from "../../../pages/HomePage"

const email = Cypress.env('email')
const password = Cypress.env('password')

describe('Login - CT-FD-1', () => {
  it('Deve fazer login com sucesso', () => {
      loginPage.visit();
      loginPage.elements.inputEmail().type(email);
      loginPage.elements.inputPassword().type(password);
      loginPage.elements.submitButton().click();
      cy.url().should('include', homePage.urlAcron); // Substitua '/dashboard' pela URL esperada após o login
  });
});