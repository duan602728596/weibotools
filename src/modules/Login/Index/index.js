import publicStyle from '../../../components/publicStyle/publicStyle.sass';
import Login from './Login';

export default {
  render(): Vue.VNode{
    return (
      <div>
        <div class={ publicStyle.tools }>
          <Login />
        </div>
      </div>
    );
  }
};