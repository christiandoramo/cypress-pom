import homePage from "./HomePage"

class ShelteredPage{
    urlAcron = "/sheltered"
    elements = {
        // buttonAddShelter: () => cy.get("button.shelter-add-button").contains("Abrigo"),
        inputSearchBarSheltered: () => cy.get('.shelter-families__search > .mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix'), // mat-input-29 mudou...
        
        tdFound: () => cy.get("td").first(),
        // tabItemSheltered: () =>cy.get('#mat-tab-label-0-3'),
        // buttonAddFamily: () => cy.get('button.shelter-families__add-button'),
        // buttonAddFamilyManualyInModal: () => cy.get('button.fuse-mat-button-medium').contains("Adicionar Manualmente"),
    }
    visit(){
        homePage.elements.buttonNavBarSheltereds().click()
    }
}
const shelteredPage = new ShelteredPage()
export default shelteredPage;