describe('Login via API', () => {
    it('Faz login e armazena o token', () => {
      cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + '/auth/login', // URL da API de login
        body: {
          username: Cypress.env('email'),
          password: Cypress.env('password')
        }
      }).then((response) => {
        expect(response.status).to.eq(200); // realizado com sucesso?
  
        // Verifica se a resposta contém um token
        // expect(response.body).to.have.property('token'); // Ajuste conforme a estrutura da resposta
        const token = response.body;
        cy.log("token: ",token)

        expect(token).to.be.a('string').and.not.to.be.empty;
        
        Cypress.env('XAuthToken', token);
      });
    });
  });