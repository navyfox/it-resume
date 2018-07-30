import {Api} from '../api';

const initialState = {auth: false};

const RELOAD = 'RELOAD';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export const loginUser = (name, pass) => (dispatch) => {
    Api.login(name, pass).then(response => {
        console.log('response', response);
        return response.data;
    }).then(data => {
        localStorage.setItem('auth', true);
        dispatch({
            type: 'LOGIN',
            name: data.current_user.name,
            id: data.current_user.uid,
            csrf_token: data.csrf_token,
            logout_token: data.logout_token,
            auth: true,
        });
    });
};

export const logoutUser = () => (dispatch) => {
    let status = Api.logout();
    if (status) {
        localStorage.setItem('auth', false);
        dispatch({
            type: 'LOGOUT',
            auth: false,
        });
    }
};

export const reload = () => (dispatch) => {
    if (!(localStorage.getItem("auth") === null)) {
        const auth = JSON.parse(localStorage.getItem("auth"));
        dispatch({
            type: 'RELOAD',
            auth,
        });
    }
};

export const signUp = (name, pass, email) => (dispatch) => {
    Api.register(name, pass, email);
};

const ACTION_HANDLERS = {
    [RELOAD]: (state, action) => Object.assign(state, action),
    [LOGIN]: (state, action) => Object.assign(state, action),
    [LOGOUT]: (state, action) => Object.assign(state, action),
};

export default function user(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
