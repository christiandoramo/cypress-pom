class LoginPage{
    urlAcron = "/entrar"
    signOutUrlAcron = "/sign-out"

    elements = {
        inputEmail: () => cy.get("#email"),
        inputPassword : () => cy.get("#password"),
        submitButton : () =>  cy.get('button.mdc-button'), // podia testar .contains("Entrar") 

    }
    visit(){
        cy.visit(Cypress.env("url") + this.urlAcron)
    }
}
const loginPage = new LoginPage()
export default loginPage;