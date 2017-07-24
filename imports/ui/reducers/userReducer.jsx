const providerReducer = (
    state = {
    accounts: {
            ethereum : [],
            steem: [],
            bitshares: []
            }
    }
    , action) => {
    switch(action.type){
        case "ADD_ACCOUNT":
            state = {
                accounts: {
                    ...state.accounts,
                    [action.payload.providerName]: [...state.accounts[action.payload.providerName], action.payload]
                }
            };
            break;
    }
    return state;
};

export default providerReducer;