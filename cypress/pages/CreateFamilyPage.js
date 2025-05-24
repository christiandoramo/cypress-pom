// primeiro 0-mes/0-dia/ano 

class CreateFamilyPage{
    urlAcron = "/shelters/new"
    modalAddFamilyMemberElements = {
        inputPhone : () =>  cy.get('#phone'), 
        inputName: () => cy.get("#name"),

        selectGender: () => cy.get(".person-form__gender"),
        optionGenderFemale: () => cy.get('mat-option').eq(0).contains("Feminino"),
        optionGenderMale: () => cy.get('mat-option').eq(1).contains("Masculino"),
        optionGenderNotInformed: () => cy.get('mat-option').eq(2).contains("Não Informado"),
   
        inputCPF: () => cy.get("#cpf"),

        selectColor: () => cy.get('.person-form__color-race'),
        optionColorWhite: () => cy.get('mat-option').eq(0).contains("Branca"), // verificar se IDs ainda estão mudando
        optionColorBrown: () => cy.get('mat-option').eq(1).contains("Parda"),
        optionColorBlack: () => cy.get('mat-option').eq(2).contains("Preta"),
        optionColorYellow: () => cy.get('mat-option').eq(3).contains("Amarela"),
        optionColorIndigenous: () => cy.get('mat-option').eq(4).contains("Indígena"),
        optionColorNotInformed: () => cy.get('mat-option').eq(5).contains("Não Informado"),

        datePickerBirthDate: () => cy.get('.person-form__birthdate input'),

        checkBoxIsResponsible: () => cy.get('.person-form__owner'),
        buttonConfirmAdd: () => cy.get('.dialog__buttons-right > button').contains('Adicionar'),
    }
    elements = {


        checkBoxNoAddress: () => cy.get("#mat-mdc-checkbox-6-input"),
        inputPhone1: () => cy.get("#phone1"),
        inputPhone2: () => cy.get("#phone2"),

        selectHousingAffected: () => cy.get('#mat-select-value-7'),
        optionHousingAffected: () => cy.get("mat-option"),

        inputGoodsLost: () => cy.get('#bensPerdidosEmergencia'),

        buttonAddFamilyMember: () => cy.get('.family-form__add-button > button'),

        // campos textuais
        inputZipCode : () => cy.get("#zipCode"),
        inputCity : () =>  cy.get('#city'), 
        inputStreet : () =>  cy.get('#street'), 
        inputNumber : () =>  cy.get('#number'), 

        // campos select
        // State
        selectState: () => cy.get('#mat-select-value-5'),
        optionState: (optionText) => cy.get("mat-option").contains(optionText), // para facilitar o estado é digitado manualmente
    
        // Cadastro
        buttonRegister: () => cy.get("button.shelter-add-button").contains("Cadastrar")
    }
}
const createFamilyPage = new CreateFamilyPage()
export default createFamilyPage;