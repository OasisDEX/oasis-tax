
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

export function addTrade(trade) {
    return {
        type: "ADD_TRADE",
        payload: trade
    };
}




