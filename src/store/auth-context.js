import react, { useState } from "react";

const AuthContext = react.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

const calRemtime = (time) => {
    const crrTime = new Date().getTime();
    const adjExpTime = new Date(time).getTime();
    const rem = adjExpTime - crrTime;
    return rem;
}

export const AuthContextProvide = (props) => {
    const tokenString = localStorage.getItem('token');
    const [token, setToken] = useState(tokenString);

    const userIsLoggedIn = !!token;

    const logoutHandler = () => {
        localStorage.clear();
        setToken(null);
    }

    const loginHandler = (token, time) => {
        setToken(token);
        localStorage.setItem('token', token);
        const rem = calRemtime(time);
        setTimeout(() => {
            logoutHandler();
        }, rem);
    }

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;