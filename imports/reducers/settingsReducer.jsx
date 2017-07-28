const settingsReducer = (
    state = {
        options:[
            {id:"oasis", active: true, name: "Load data from Oasis (https://oasisdex.com)" },
            {id:"etherdelta", active: false, name: "Load data from Etherdelta (https://ether.delta)" },
            {id:"bitshares", active: false, name: "Alias IOU assets on Bitshares" }
            ]
        ,
        email: "",
        activeProvider: "ethereum",
        hasPayed: false,
        isLoading: false
    }
    , action) => {
    switch(action.type){
        case "INVERSE_OPTION":
            state = {
                ...state,
                options: state.options.map(
                    (option) => option.id === action.payload.id ? {...option, active: !action.payload.active} : option
                )
            };
            break;
        case "SET_EMAIL":
            state = {
                ...state,
                email: action.payload
            };
            break;
        case "SET_PICKER":
            state = {
                ...state,
                activeProvider: action.payload
            };
            break;
    }
    return state;
};

export default settingsReducer;