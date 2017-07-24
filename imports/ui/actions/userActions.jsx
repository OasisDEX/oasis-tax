export function addAccount(name) {
    return {
        type: "ADD_ACCOUNT",
        payload: name
    };
}