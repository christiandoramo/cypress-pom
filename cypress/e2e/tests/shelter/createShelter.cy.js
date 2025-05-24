import loginPage from "../../../pages/LoginPage"
import homePage from "../../../pages/HomePage"
import createShelterPage from "../../../pages/CreateShelterPage" 
import shelterPage from "../../../pages/ShelterPage"

const email = Cypress.env('email')
const password = Cypress.env('password')

describe('Cadastro de abrigos ', () => {
  let table
  before(() => {
    cy.readFile('cypress/fixtures/cadunico.csv').then((csv) => {
      // Converte o CSV para um array de objetos
      const rows = csv.split('\n'); // Divide o CSV em linhas
      const headers = rows[0].split(','); // Pega o cabeçalho (nomes das colunas)
      table = rows.slice(1).map((row) => {
        const values = row.split(','); // Divide cada linha em valores
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]; // Cria um objeto com chaves e valores
          return obj;
        }, {});
      });
     })
     // console.table(table);

})

  beforeEach(() => { // voltando para a página
    loginPage.visit();
    loginPage.elements.inputEmail().type(email);
    loginPage.elements.inputPassword().type(password);
    loginPage.elements.submitButton().click();
    cy.url().should('include', homePage.urlAcron);
    createShelterPage.visit();
    cy.url().should('include',  createShelterPage.urlAcron);
  })

  it('Deve criar um novo abrigo com sucesso usando o carregador de dados via CEP com dados do cadUnico - CT-AB-1', () => {
        const line = Math.floor(Math.random() * table.length)
        const randomData = table[line]; // pegando linnha aleatoria do cadunico

        const info = { // "correção" de problema na importação
          cep: randomData[' d.num_cep_logradouro_fam'],
          nome: randomData[' p.nom_pessoa'],
          numero: randomData[' d.num_logradouro_fam'],
          telefone: randomData[' d.num_tel_contato_1_fam'],
          cpf: randomData[' d.num_cpf_pessoa'],
          pcd: randomData[' p.cod_deficiencia_memb'],
          sex: randomData[' p.cod_sexo_pessoa'],
          cor:   randomData[' p.cod_raca_cor_pessoa'],
          nasc: randomData[' p.dta_nasc_pessoa'],
        };
        
        createShelterPage.elements.inputZipCode().type(`${info.cep}{enter}`); // setando o CEP
        cy.wait(2000); // aguardando cep carregar

        createShelterPage.elements.selectType().click();
        createShelterPage.elements.optionTypeSchool().click();

        // campos foram preenchidos com o cep?
        createShelterPage.elements.inputStreet().should('not.have.value', '');
        createShelterPage.elements.inputCity().should('not.have.value', '');
        createShelterPage.elements.selectState().should('not.have.text', '')
        // campos foram preenchidos

        const shelterName = `Abrigo ${line+1} - Christian`
        createShelterPage.elements.inputName().type(shelterName);//.type(randomData.p.nom_pessoa);
        createShelterPage.elements.inputNumber().type(info.numero);
        createShelterPage.elements.inputPhone().type(info.telefone + "99");
        createShelterPage.elements.inputEmail().type("responsavel@email.com"); 
        createShelterPage.elements.selectResponsible().click()
        createShelterPage.elements.inputResponsible().type("Christian")

        //createShelterPage.elements.selectResponsible().should('be.equal','')        
        cy.wait(4000); 
        createShelterPage.elements.optionResponsible().click();
        createShelterPage.elements.inputCapacity().type("100"); 
        createShelterPage.elements.inputNote().type("Lorem Ipsum"); 

        cy.wait(1000)
        createShelterPage.elements.buttonRegister().should('be.visible').click()       
        cy.url().should('include',  shelterPage.urlAcron);
        // agora verificar  na tabela se realmente cadastrou um abrigo com o mesmo nome e pronto

        shelterPage.visit(); // caminho por abrigos
        shelterPage.elements.inputSearchBarShelter().type(shelterName); // busca nome do abrigo criado
        cy.wait(2000)

        shelterPage.elements.tdFound().then(($td) => {
          expect($td.text().trim()).to.equal(shelterName);
        });
  });
  // proximo teste - nao deve ser possivel criar abrigo com cep inválido (vai falhar)
  it.only('Não deve ser possível criar abrigo com CEP inválido - CT-AB-3', () => {
    // Tenta criar um abrigo com CEP inválido
    createShelterPage.elements.inputZipCode().type('00000000{enter}');
    cy.wait(2000); // Aguarda o CEP carregar

    // campos NÃO foram preenchidos
    createShelterPage.elements.inputStreet().should('have.value', '');
    createShelterPage.elements.inputCity().should('have.value', '');
    createShelterPage.elements.selectState().should('have.text', '');

    createShelterPage.elements.selectType().click();
    createShelterPage.elements.optionTypeSchool().click();

    // preenchendo
    createShelterPage.elements.inputStreet().type("Rua X")
    createShelterPage.elements.inputCity().type("Cidade X")
    createShelterPage.elements.selectState().click()
    createShelterPage.elements.optionState("Pernambuco").click()

    // dados inválidos

    const shelterName = `Abrigo ${Math.floor(Math.random() * 100000)} - Grupo ${Math.floor(Math.random() * 100000)} Christian}`
    createShelterPage.elements.inputName().type(shelterName);
    createShelterPage.elements.inputNumber().type('123');
    createShelterPage.elements.inputPhone().type('9999999999');
    createShelterPage.elements.inputEmail().type('responsavel@email.com');
    createShelterPage.elements.selectResponsible().click()
    createShelterPage.elements.inputResponsible().type("Christian")
    cy.wait(4000); 
    createShelterPage.elements.optionResponsible().click();

    createShelterPage.elements.inputCapacity().type('100');
    createShelterPage.elements.inputNote().type('Lorem Ipsum');

    cy.wait(1000);
    createShelterPage.elements.buttonRegister().should('be.visible').click();

    cy.url().should('include', createShelterPage.urlAcron); 

    // verificação
    shelterPage.visit(); // caminho por abrigos
    shelterPage.elements.inputSearchBarShelter().type(shelterName); // busca nome do abrigo criado
    cy.wait(2000)

    shelterPage.elements.tdFound().then(($td) => { // não deve ser o nome achado
      expect($td.text().trim()).to.not.equal(shelterName);
    });
  });
})