import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../imports/ui/App.jsx'
import { render } from 'react-dom';



export default AppContainer = createContainer(props => {
    // props here will have `main`, passed from the router
    // anything we return from this function will be *added* to it
    const buys = [];
    const sells = [];
    const services = [
        { accounts: [], type: 'ethereum'},
        { accounts: [], type: 'steem'},
        { accounts: [], type: 'bitshares'}
    ];

    return {
        buys,
        sells,
        services,
};
}, App);


Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});
