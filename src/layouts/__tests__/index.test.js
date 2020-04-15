import BasicLayout from '..';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('Layout: BasicLayout', () => {
  it('Render correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<BasicLayout />);
    const result = renderer.getRenderOutput();
    expect(result.type).toBe('div');
    expect(result.props.children.length).toBe(2);
    const outerLayer = result.props.children[0];
    expect(outerLayer.type).toBe('div');
    const title = outerLayer.props.children[0];
    expect(title.props.className).toBe('header');

    // const wrapper = renderer.create(<BasicLayout />);
    // expect(wrapper.root.children.length).toBe(1);
    // const outerLayer = wrapper.root.children[0];
    // expect(outerLayer.type).toBe('div');
    // const title = outerLayer.children[0];
    // expect(title.type).toBe('h1');
    // expect(title.children[0]).toBe('Yay! Welcome to umi!');
  });
});
