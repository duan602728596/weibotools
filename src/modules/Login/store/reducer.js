import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData: Object = {
  userList: List([])
};

/* Action */
export const userList: Function = createAction('login-用户账号列表');

/* reducer */
const reducer: Function = handleActions({
  [userList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Array = action.payload;
    return $$state.set('userList', List(data));
  }
}, fromJS(initData));

export default {
  login: reducer
};