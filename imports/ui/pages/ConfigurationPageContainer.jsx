import React, {Component}  from 'react';
import ConfigurationPage from './ConfigurationPage';
import { createContainer } from 'meteor/react-meteor-data';

class ConfigurationPageContainer extends Component {

    render(){
        return <ConfigurationPage/>
    }

}

export default createContainer(({active, email, services, changeState, updateEmail}) => {
    return {
        active: active,
        email: email,
        services: services,
        changeState: changeState,
        updateEmail: updateEmail,
    }
}, ConfigurationPage);
