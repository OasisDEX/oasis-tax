import update from 'react-addons-update';

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
                    ethereum: [...state.accounts.ethereum, action.payload]
                }
            };
            return state;
    }
    return state;
};

export default providerReducer;