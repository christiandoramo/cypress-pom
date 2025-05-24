import homePage from "./HomePage"

class ShelterPage{
    urlAcron = "/shelters"
    elements = {
        buttonAddShelter: () => cy.get("button.shelter-add-button").contains("Abrigo"),
        inputSearchBarShelter: () => cy.get("#mat-input-2"), // mat-input-29 mudou... ja foi 2 e mudou...
        
        tdFound: () => cy.get("td").first(),
        tabItemSheltered: () =>cy.get('#mat-tab-label-0-3'),
        buttonAddFamily: () => cy.get('button.shelter-families__add-button'),
        buttonAddFamilyManualyInModal: () => cy.get('button.fuse-mat-button-medium').contains("Adicionar Manualmente"),
    }
    visit(){
        homePage.elements.buttonNavBarShelters().click()
    }
}
const shelterPage = new ShelterPage()
export default shelterPage;