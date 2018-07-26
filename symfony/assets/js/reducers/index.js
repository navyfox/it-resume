import { combineReducers } from 'redux';
import user from './user';
import resumeItem from './resumeItem';

export default combineReducers({
    user,
    resumeItem,
});
