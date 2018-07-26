
const initialState = {};

const GET_USER_NAME = 'GET_USER_NAME';

export const getUserName = (userName) => (dispatch) => {
    dispatch({
        type: 'GET_USER_NAME',
        userName
    });
};

const ACTION_HANDLERS = {
    [GET_USER_NAME]: (state, action) => state.update('userName', () => action.userName),
};

export default function user(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
