// primeiro 0-mes/0-dia/ano 
import loginPage from "../../../pages/LoginPage"
import homePage from "../../../pages/HomePage"
import shelterPage from "../../../pages/ShelterPage"
import createFamilyPage from "../../../pages/CreateFamilyPage"
import { castDateStringCadunicoToAcolhe } from "../../../utils/date"
import shelteredPage from "../../../pages/ShelteredPage"
import gerarCpf from "../../../utils/cpf"

const email = Cypress.env('email')
const password = Cypress.env('password')

describe('Cadastro de famílias', () => {
  let table
  let lastInfo
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
    shelterPage.visit(); // caminho para criar por abrigos
    shelterPage.elements.inputSearchBarShelter().type('Abrigo 3 - Grupo Christian'); // abrigo qualquer
    cy.wait(2000)
    shelterPage.elements.tdFound().click();
    shelterPage.elements.tabItemSheltered().click();
    shelterPage.elements.buttonAddFamily().click();
    shelterPage.elements.buttonAddFamilyManualyInModal().click();
  })

  it('Deve criar uma nova família com base em dados do cadUnico - CT-AC-1', () => {
        const min = 1
        const max = table.length
        const line = Math.floor(Math.random() * (max - min) + min)
        const randomData = table[line]; // pegando linnha aleatoria do cadunico

        const info = { // "correção" de problema na importação
          cep: randomData[' d.num_cep_logradouro_fam'],
          nome: randomData[' p.nom_pessoa'],
          numero: randomData[' d.num_logradouro_fam'],
          telefone: randomData[' d.num_tel_contato_1_fam'],
          cpf: randomData[' d.num_cpf_pessoa']  ?? gerarCpf().toString(),//"93714178465",
          pcd: randomData[' p.cod_deficiencia_memb'],
          gender: randomData[' p.cod_sexo_pessoa'],
          color:   randomData[' p.cod_raca_cor_pessoa'],
          nasc: randomData[' p.dta_nasc_pessoa'],
        };
        lastInfo = info
        // campos da familia
        
        createFamilyPage.elements.inputZipCode().type(`${info.cep}{enter}`); // setando o CEP
        cy.wait(2000); // aguardando cep carregar

        createFamilyPage.elements.inputStreet().should('not.have.value', '');
        createFamilyPage.elements.inputCity().should('not.have.value', '');
        createFamilyPage.elements.selectState().should('not.have.text', '')

        createFamilyPage.elements.inputNumber().type(info.numero);
        createFamilyPage.elements.selectHousingAffected().click();
        createFamilyPage.elements.optionHousingAffected().first().click(); //clicka na primeira opção somente

        createFamilyPage.elements.buttonAddFamilyMember().click()
        cy.wait(500)

        // campos do membro - modal
        createFamilyPage.modalAddFamilyMemberElements.inputCPF().type(info.cpf)
        createFamilyPage.modalAddFamilyMemberElements.inputName().type(info.nome);//.type(randomData.p.nom_pessoa);
        createFamilyPage.modalAddFamilyMemberElements.inputPhone().type(info.telefone + "99");

        createFamilyPage.modalAddFamilyMemberElements.selectGender().click();
        switch(info.gender){
          case "1":
            createFamilyPage.modalAddFamilyMemberElements.optionGenderFemale().click()
            break;
          case "2":
            createFamilyPage.modalAddFamilyMemberElements.optionGenderMale().click()
           break;
          default:
            createFamilyPage.modalAddFamilyMemberElements.optionGenderNotInformed().click()
            break;
        }

        createFamilyPage.modalAddFamilyMemberElements.selectColor().click()
        switch(info.color){
          case "1":
            createFamilyPage.modalAddFamilyMemberElements.optionColorWhite().click()
            break;
          case "2":
            createFamilyPage.modalAddFamilyMemberElements.optionColorBrown().click()
           break;
           case "3":
            createFamilyPage.modalAddFamilyMemberElements.optionColorBlack().click()
           break;
           case "4":
            createFamilyPage.modalAddFamilyMemberElements.optionColorYellow().click()
           break;
           case "5":
            createFamilyPage.modalAddFamilyMemberElements.optionColorIndigenous().click()
           break;
          default:
            createFamilyPage.modalAddFamilyMemberElements.optionColorNotInformed().click()
            break;
        }
        // createFamilyPage.modalAddFamilyMemberElements.datePickerBirthDate().click()
        cy.wait(500)


        createFamilyPage.modalAddFamilyMemberElements.checkBoxIsResponsible().click()
        createFamilyPage.modalAddFamilyMemberElements.datePickerBirthDate().first().type(castDateStringCadunicoToAcolhe(info.nasc), { force: true })
        cy.wait(500)

        cy.get('.cdk-overlay-backdrop').then(($overlay) => {
          if ($overlay.length > 0) {
            $overlay.remove();
          }
        });
        cy.get('mat-calendar').then(($calendar) => {
          if ($calendar.length > 0) {
            $calendar.remove();
          }
        });
        createFamilyPage.modalAddFamilyMemberElements.buttonConfirmAdd().should('be.visible').click()
        cy.wait(500)

        createFamilyPage.elements.buttonRegister().should('be.visible').click()       

        cy.url().should('include',  shelterPage.urlAcron);

        /*
          Buscar familia em acolhidos pelo cpf do responsável - cada responsável só tem uma família como única
        */
        shelteredPage.visit()
        shelteredPage.elements.inputSearchBarSheltered().type(info.cpf)
        cy.wait(2000)
        shelteredPage.elements.tdFound().then(($td) => { // deve ter o nome respectivo ao cpf
          expect($td.text().trim()).to.include(info.nome);
        });
  });

  // esse TESTE DEVE SER RODADO JUNTO COM O TESTE ACIMA
  // proximo teste - nao pode criar responsavel de familia com mesmo cpf que outro ja cadastrado
  it('Não deve criar uma nova família com responsável de mesmo CPF', () => {
    createFamilyPage.elements.inputZipCode().type(`${lastInfo.cep}{enter}`); // setando o CEP
    cy.wait(2000); // aguardando cep carregar

    createFamilyPage.elements.inputStreet().should('not.have.value', '');
    createFamilyPage.elements.inputCity().should('not.have.value', '');
    createFamilyPage.elements.selectState().should('not.have.text', '')

    createFamilyPage.elements.inputNumber().type(lastInfo.numero);
    createFamilyPage.elements.selectHousingAffected().click();
    createFamilyPage.elements.optionHousingAffected().first().click(); //clicka na primeira opção somente

    createFamilyPage.elements.buttonAddFamilyMember().click()
    cy.wait(500)

    // campos do membro - modal
    createFamilyPage.modalAddFamilyMemberElements.inputCPF().type(lastInfo.cpf)
    createFamilyPage.modalAddFamilyMemberElements.inputName().type(lastInfo.nome);//.type(randomData.p.nom_pessoa);
    createFamilyPage.modalAddFamilyMemberElements.inputPhone().type(lastInfo.telefone + "99");

    createFamilyPage.modalAddFamilyMemberElements.selectGender().click();
    switch(lastInfo.gender){
      case "1":
        createFamilyPage.modalAddFamilyMemberElements.optionGenderFemale().click()
        break;
      case "2":
        createFamilyPage.modalAddFamilyMemberElements.optionGenderMale().click()
       break;
      default:
        createFamilyPage.modalAddFamilyMemberElements.optionGenderNotInformed().click()
        break;
    }

    createFamilyPage.modalAddFamilyMemberElements.selectColor().click()
    switch(lastInfo.color){
      case "1":
        createFamilyPage.modalAddFamilyMemberElements.optionColorWhite().click()
        break;
      case "2":
        createFamilyPage.modalAddFamilyMemberElements.optionColorBrown().click()
       break;
       case "3":
        createFamilyPage.modalAddFamilyMemberElements.optionColorBlack().click()
       break;
       case "4":
        createFamilyPage.modalAddFamilyMemberElements.optionColorYellow().click()
       break;
       case "5":
        createFamilyPage.modalAddFamilyMemberElements.optionColorIndigenous().click()
       break;
      default:
        createFamilyPage.modalAddFamilyMemberElements.optionColorNotInformed().click()
        break;
    }
    // createFamilyPage.modalAddFamilyMemberElements.datePickerBirthDate().click()
    cy.wait(500)


    createFamilyPage.modalAddFamilyMemberElements.checkBoxIsResponsible().click()
    createFamilyPage.modalAddFamilyMemberElements.datePickerBirthDate().first().type(castDateStringCadunicoToAcolhe(lastInfo.nasc), { force: true })
    cy.wait(500)

    cy.get('.cdk-overlay-backdrop').then(($overlay) => {
      if ($overlay.length > 0) {
        $overlay.remove();
      }
    });
    cy.get('mat-calendar').then(($calendar) => {
      if ($calendar.length > 0) {
        $calendar.remove();
      }
    });
    createFamilyPage.modalAddFamilyMemberElements.buttonConfirmAdd().should('be.visible').click() // VAI FALHAR AQUI
    cy.wait(500)

    createFamilyPage.elements.buttonRegister().click()
    cy.url().should('include', shelterPage.urlAcron); // deve ficar na mesma página
  });
})