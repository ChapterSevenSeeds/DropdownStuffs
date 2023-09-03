import renderer from 'react-test-renderer';
import DropdownSelect from './DropdownSelect';

it('changes the class when hovered', () => {
    const component = renderer.create(
        <DropdownSelect label="Label" onChange={console.log} options={[]} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});