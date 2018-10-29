import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData: Object = {
  userList: List([]),
  superTopicLoading: false,
  checkInList: {}
};

/* Action */
export const userList: Function = createAction('superTopic-用户账号列表');
export const superTopicLoading: Function = createAction('superTopic-用户账号列表加载状态');
export const checkInList: Function = createAction('superTopic-已签到列表');
export const resetList: Function = createAction('superTopic-初始化');

/* reducer */
const reducer: Function = handleActions({
  [userList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Array = action.payload;
    return $$state.set('userList', List(data));
  },
  [superTopicLoading]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const payload: boolean = action.payload;
    return $$state.set('superTopicLoading', payload);
  },
  [checkInList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Object = action.payload;
    return $$state.set('checkInList', data);
  },
  [resetList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Array = action.payload;
    return $$state.set('userList', List(data))
      .set('checkInList', {});
  }
}, fromJS(initData));

export default {
  superTopic: reducer
};