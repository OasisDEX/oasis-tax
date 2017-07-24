export function addAccount(account) {
    return {
        type: "ADD_ACCOUNT",
        payload: account
    };
}

export function removeAccount(account) {
    return {
        type: "REMOVE_ACCOUNT",
        payload: account
    };
}
