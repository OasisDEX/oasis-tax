const settingsReducer = (
    state = {
        options:[
            { "active": true, "name": "Load data from Oasis (https://oasisdex.com)" },
            { "active": false, "name": "Load data from Etherdelta (https://ether.delta)" },
            { "active": false, "name": "Alias IOU assets on Bitshares" }
            ]
        ,
        email: ''
    }
    , action) => {
    switch(action.type){
        case "ENABLE_OPTION":
            state = {
            };
            break;
        case "DISABLE_OPTION":
            state = {
            };
            break;
        case "SET_EMAIL":
            state = {

            };
            break;
    }
    return state;
};

export default settingsReducer;