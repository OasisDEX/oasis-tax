import React from 'react';
import App from '../imports/App.jsx'
import {Provider} from "react-redux"
import { render } from 'react-dom';
import store from "../imports/store";

Meteor.startup(() => {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app'));
});
