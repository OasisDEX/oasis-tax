export function enableOption(option) {
    return {
        type: "ENABLE_OPTION",
        payload: option
    };
}

export function disableOption(option) {
    return {
        type: "DISABLE_OPTION",
        payload: option
    };
}

export function setEmail(email) {
    return {
        type: "SET_EMAIL",
        payload: email
    };
}