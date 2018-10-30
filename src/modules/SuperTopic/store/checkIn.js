import { createAction, handleActions } from 'redux-actions';

/* Action */
export const superTopicLoading: Function = createAction('superTopic-checkIn-用户账号列表加载状态');
export const checkInList: Function = createAction('superTopic-checkIn-已签到列表');

/* reducer */
const reducer: Function = handleActions({
  [superTopicLoading]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const payload: boolean = action.payload;
    return $$state.set('superTopicLoading', payload);
  },
  [checkInList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    const { data }: Object = action.payload;
    return $$state.set('checkInList', data);
  }
}, {});

export default reducer;