describe('Consulta de Famílias via API - CT-AU-1', () => {
    let token
    before(() => {
      cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + '/auth/login', 
        body: {
          username: Cypress.env('email'),
          password: Cypress.env('password')
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
  
        token = response.body;
        cy.log('Token recebido:', token); 
  
        expect(token).to.be.a('string').and.not.to.be.empty;
  
        Cypress.env('XAuthToken', token);
      });
    });
  
    it('Deve conseguir fazer consulta de família de acolhidos ao estar autenticado', () => {
      cy.request({
        method: 'GET',
        url: Cypress.env('apiUrl') + '/family?query=&page=0&size=25',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Token': token
          },
      }).then((response) => {

        expect(response.status).to.eq(200); // resposta 2xx, é OK?
  
        cy.log('Resposta da consulta:', JSON.stringify(response.body, null, 2));
  
        expect(response.body).to.have.property('content').and.to.be.an('array'); 
        expect(response.body.content).to.have.length.greaterThan(0);
      });
    });
  });