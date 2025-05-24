import homePage from "./HomePage";
import shelterPage from "./ShelterPage";

class CreateShelterPage{
    urlAcron = "/shelters/new"
    elements = {        
        
        // campos textuais
        inputName: () => cy.get("#name"),
        inputZipCode : () => cy.get("#zipCode"),
        inputCity : () =>  cy.get('#city'), 
        inputStreet : () =>  cy.get('#street'), 
        inputNumber : () =>  cy.get('#number'), 
        inputPhone : () =>  cy.get('#phone'), 
        inputEmail : () =>  cy.get('#email'), 
        inputCapacity : () =>  cy.get('#capacity'), 
        inputNote : () =>  cy.get('#note'), 
        // campos select

        // Tipo
        selectType: () => cy.get("#mat-select-value-3"),
        optionTypeSchool : () => cy.get("#mat-option-4"),
        optionTypeHouse : () =>  cy.get("#mat-option-5"),
        optionTypeChurch : () =>  cy.get("#mat-option-6"),

        // State
        selectState: () => cy.get("#mat-select-value-5"),
        optionState: (optionText) => cy.get("mat-option").contains(optionText), // para facilitar o estado é digitado manualmente
    
        // Resposible
        selectResponsible: () => cy.get("div#mat-select-value-7"),
        inputResponsible: () => cy.get('.mat-select-search-inner > .mat-select-search-input'),
        optionResponsible: () => cy.get("mat-option").eq(1) ,//.first(), // para facilitar o estado é digitado manualmente

        // Cadastro
        buttonRegister: () => cy.get("button.shelter-add-button").contains("Cadastrar")
    }
    visit(){
        homePage.elements.buttonNavBarShelters().click();
        shelterPage.elements.buttonAddShelter().click();
    }
}
const createShelterPage = new CreateShelterPage()
export default createShelterPage;