import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from "redux-logger";

import providers from "./reducers/providersReducer";
import settings from "./reducers/settingsReducer";

export default createStore(
    combineReducers({
        providers,
        settings
    }),
    {},
    applyMiddleware(logger)
);
