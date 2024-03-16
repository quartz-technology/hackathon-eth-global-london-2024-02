describe('Home Page Test', () => {
	it('Displays the text "Hello world!"', () => {
		cy.visit('/');

		cy.get('h1').should('have.class', 'text-3xl').contains('Hello world!');
	});
});
