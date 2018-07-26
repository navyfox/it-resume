import {Api} from '../api';


const initialState = {};

const GET_RESUME_ITEM = 'GET_RESUME_ITEM';
const GET = 'GET';

export const getResumeItem = (id) => (dispatch) => {
    console.log('idUR', id);
    Api.getResumeItem(id).then(item => {
        dispatch({
            type: 'GET_RESUME_ITEM',
            item,
        });
    });
};

const ACTION_HANDLERS = {
    [GET_RESUME_ITEM]: (state, action) => action.item,
    [GET]: (state, action) => state,
};

export default function resumeItem(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
