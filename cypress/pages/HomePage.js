class HomePage{
    urlAcron = '/dashboard'
    elements ={
        buttonNavBarSheltereds: () => cy.get("div.fuse-vertical-navigation-item-wrapper").contains("Acolhidos"),
        // ou cy.get(':nth-child(6) > .fuse-vertical-navigation-item-wrapper > .mat-mdc-tooltip-trigger')
        buttonNavBarShelters: () => cy.get("div.fuse-vertical-navigation-item-wrapper").contains("Abrigos"),
        profileButton: ()=> cy.get("button.mat-mdc-menu-trigger"),
        logoutButton: () => cy.get("button.mat-mdc-menu-item").contains('Sair')// mesmo pegando o elemento inteiro ainda achava 3 elementos
    }

    visit(){
        cy.visit(Cypress.get("url") + this.urlAcron)
    }
}
const homePage = new HomePage()
export default homePage;