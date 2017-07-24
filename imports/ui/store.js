import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from "redux-logger";

import user from "./reducers/userReducer";
import settings from "./reducers/settingsReducer";

export default createStore(
    combineReducers({
        user,
        settings
    }),
    {},
    applyMiddleware(logger)
);
