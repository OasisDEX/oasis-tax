import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from "redux-logger";
import providers from "./reducers/providersReducer";
import settings from "./reducers/settingsReducer";
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

export default createStore(
    combineReducers({
        providers,
        settings
    }),
    {},
    applyMiddleware(logger,thunk,promise())
);
