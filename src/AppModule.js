import Arrangement from './assembly/Arrangement/index';

export default {
  name: 'AppModule',
  render(): Vue.VNode{
    return (
      <div class="app" id="app">
        <Arrangement />
      </div>
    );
  }
};