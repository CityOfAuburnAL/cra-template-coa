import { trackPromise } from 'react-promise-tracker';

/**
 * Custom fetch function providing default options and error handling
 * @param {string} url url to fetch
 * @param {object} options optional, options to override defaults
 */
export const coaFetch = (url, options) => {
    //Default options, in case blank
    options = options || {};
    //Set defaults
    let defaultOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type' : 'application/json' }
    };
    //Merge defaults and custom options
    options = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
    }

    return trackPromise(
        fetch(url, options)
            .then(handleResponse, handleNetworkError)
            .catch(handleNetworkError)
    );
}

function handleResponse (response) {
    if (response.ok) {
        if (response.status === 204) return; //No content, will error if you run json().
        return response.json();
    } 
    throw new Error(`(${response.status}) ${response.statusText}`);
}

function handleNetworkError (error) {
    throw new Error(`(Error) ${error.message}`);
}

/** Runs custom fetch function, but rejects if it takes longer than provided number of miliseconds */
export const coaFetchTimed = (url, options, timer) => {
    return Promise.race([timeout(timer), coaFetch(url, options)]);
}

function timeout (value) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error('Sorry, request timed out.'));
        }, value);
    })
}