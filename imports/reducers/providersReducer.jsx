const providerReducer = (
    state = {
        ethereum: { accounts: [], name: "ethereum", type: "address", url: "oasisdex.com" },
        steem: { accounts: [], name: "steem", type: "username", url: "steemit.com" },
        bitshares: {accounts:[], name: "bitshares", type: "username", url: "bitshares.org" },
    }
    , action) => {
    switch(action.type){
        case "ADD_ACCOUNT":
            state = {
                ...state,
                    [action.payload.provider]: {
                        ...state[action.payload.provider],
                        accounts: [...state[action.payload.provider].accounts, action.payload]
                    }
            };
            break;
        case "REMOVE_ACCOUNT":
            state = {
                ...state,
                [action.payload.provider]: {
                    ...state[action.payload.provider],
                    accounts: state[action.payload.provider].accounts.filter(item => action.payload !== item),
                }
            };
            break;
        case "ADD_TRADE":
            state = {
                ...state,
                [action.payload.provider]: {
                    ...state[action.payload.provider],
                    accounts: state[action.payload.provider].accounts.map(item => item.name === action.payload.accountName ? {...item, trades: [ ...item.trades, action.payload.trade]} : item),
                }
            };
            break;
        case "GET_LEGACY_TRADES_FULFILLED":
            break;
    }
    return state;
};

export default providerReducer;
