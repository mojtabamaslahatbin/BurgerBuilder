import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
    };
};

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
    };
};
export const authLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime * 1000);
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        let url =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBVjYTKno4I9U4g0ph7H2DqGWvTN5CfAR8";
        if (!isSignup) {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBVjYTKno4I9U4g0ph7H2DqGWvTN5CfAR8";
        }
        axios
            .post(url, authData)
            .then(response => {
                const { idToken, localId, expiresIn } = response.data;
                const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                localStorage.setItem("token", idToken);
                localStorage.setItem("userId", localId);
                localStorage.setItem("expirationDate", expirationDate);
                dispatch(authSuccess(idToken, localId));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error));
            });
    };
};

export const checkAuthStatus = () => {
    return dispatch => {
        const expirationDate = new Date(localStorage.getItem("expirationDate"));
        if (expirationDate <= new Date()) {
            dispatch(authLogout());
        } else {
            const token = localStorage.getItem("token");
            if (token) {
                const userId = localStorage.getItem("userId");
                dispatch(authSuccess(token, userId));
                dispatch(
                    checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000)
                );
            } else {
                dispatch(authLogout());
            }
        }
    };
};
