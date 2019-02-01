import Main from '../../assembly/Main/index';
import Content from '../../assembly/Content/index';
import Index from './Index/index';

export default {
  render(): Vue.VNode{
    return (
      <Main>
        <Content>
          <Index />
        </Content>
      </Main>
    );
  }
};