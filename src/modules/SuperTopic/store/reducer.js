import { createAction, handleActions, combineActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import checkInReducer, * as checkInAction from './checkIn';

const initData: Object = {
  userList: List([]),
  checkIn: {
    superTopicLoading: false,
    checkInList: {}
  }
};

/* Action */
export const userList: Function = createAction('superTopic-用户账号列表');

/* reducer */
const reducer: Function = handleActions({
  [userList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Array = action.payload;
    return $$state.set('userList', List(data));
  },
  [combineActions(...Object.values(checkInAction))]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    return $$state.set('checkIn', checkInReducer($$state.get('checkIn'), action));
  }
}, fromJS(initData));

export default {
  superTopic: reducer
};