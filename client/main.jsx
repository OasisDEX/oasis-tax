import React from 'react';
import App from '../imports/ui/App.jsx'
import { render } from 'react-dom';



Meteor.startup(() => {
    render(<App />, document.getElementById('app'));
});
