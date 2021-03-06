//SHOULDNT BE NEEDED IF WE CAN SHARE COOKIE, but right now we need a different cookie per microframework... sooo
//import { useState, useEffect, useCallback } from 'react';
//IE compat (not needed because IE bug: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8680109/)
//import 'whatwg-fetch';
//import Promise from 'promise-polyfill';
//if (!window.Promise) { window.Promise = Promise; }

/**
 * Supports getting user information as well as triggering login when user is not logged in.
 *
 * @todo Redirecting to login means the potential to lose work if application doesn't saveState / loadState
 * @todo Microframeworks share the same cookie/auth but I'd need to create an auth microFramework or share with main apiv2 so we don't need to pass param
 * @todo Need to recreate logout (delete localStore and remove cookies)
 * @todo Logout timer? You are going to be logged out in? I mean, it already happens based on something from cookie or auth so might as well warn user, perhaps call saveState function
 * 
 * @param {string} microFramework
 * @returns {object}
 */

async function userLogin() {
    const handleNoAuth = () => {
        //just assume all errors here are for not authorized
        if (navigator.onLine) { // Don't try to redirect to auth server while offline, else user will have a bad time
            localStorage.removeItem('user');
            //so this works but causes a refresh, we'd need the application to saveState, then update login, then load state. It's possible and likely the best way to handle it.
            let redirect = window.location.href;
            window.location.href = `https://api2.auburnalabama.org/bodycamera/login?redirect=${redirect}`;
        }
    }

    const fetchUserProfile = async () => {
        //if can't get profile in 2.5s, attempt to reauthenticate
        const timeout = setTimeout(handleNoAuth, 2500);
        //console.log(document.referrer);
        let user = await fetch(`https://api2.auburnalabama.org/bodycamera/me`, { method: 'GET', credentials: 'include', headers: { 'Content-Type' : 'application/json' }})
            .then((response) => {
                clearTimeout(timeout);
                return response;
            })
            .then((response) => {
                try {
                    return response.json();
                } catch { // if we fail to parse json, attempt reauth
                    handleNoAuth();
                }
            })
            .then((user) => {
                if (!user.email) { // if user has no email value, attempt reauth
                    handleNoAuth();
                }
                // set fetched credentials
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            })
            .catch(() => {
                clearTimeout(timeout);
                handleNoAuth();
            });
        if (user && user.email) return user;
    }

    //const SCHEMA = {"name":{"fullName":"","firstName":"","lastName":""},"email":"","phone":null,"department":null,"title":null,"employeeNumber":null,"userPrincipalName":"","roles":[]};
    //let userProfile = localStorage.getItem('user') || SCHEMA;
    
    return await fetchUserProfile();
}

function userLogout() {
    localStorage.removeItem('user');
    //document.cookie = "MICROAPI_AUTH= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"; //cookies are secured so I can't mess with them, send it to server instead
    //document.location = 'https://www.auburnalabama.org/';
    document.location = 'https://api2.auburnalabama.org/pressrelease/signout';
}

export { userLogout, userLogin };