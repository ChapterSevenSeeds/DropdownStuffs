/* eslint-disable cypress/unsafe-to-chain-command */
import DropdownSelect from './DropdownSelect'
const options = [
    { label: "1", value: "1" },
    { label: "2", value: "2" }
];

describe('<DropdownSelect />', () => {
    it('Renders', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
    });
    it('Has label', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").should("have.text", "Label");
    });
    it('No dropdown by default', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=dropdown-root]").should("not.exist");
    });
    it('Opens dropdown', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").click();
        cy.get("[data-cy=dropdown-root]").should("exist");
        cy.get("[data-cy=select-root]").click();
        cy.get("[data-cy=dropdown-root]").should("not.exist");
    });
    it('Dropdown shows items', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").click();
        cy.get("[id=option-1]").should("exist");
        cy.get("[id=option-2]").should("exist");
    });
    it('Clicking item changes select text', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").click();
        cy.get("[id=option-1]").click();
        cy.get("[data-cy=select-root]").should("have.text", "1");
    });
    it('Keyboard navigation', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").click();
        cy.get("[data-cy=search-box]")
            .trigger("keydown", { keyCode: 40 })
            .trigger("keydown", { keyCode: 40 })
            .trigger("keydown", { keyCode: 13 });
        cy.get("[data-cy=select-root]").should("have.text", "2");
    });
    it('Searchable', () => {
        cy.mount(<DropdownSelect label="Label" onChange={console.log} options={options} />);
        cy.get("[data-cy=select-root]").click();
        cy.get("[data-cy=search-box]").type("1");
        cy.get("[id=option-1]").should("exist");
        cy.get("[id=option-2]").should("not.exist");
    });
})