import React, {Component}  from 'react';
import GenerateReportPage from './GenerateReportPage';
import { createContainer } from 'meteor/react-meteor-data';


class GenerateReportPageContainer extends Component {

    render(){
        return <ConfigurationPage/>
    }

}

export default createContainer(({services}) => {
    return {
        services: services,
    }
}, GenerateReportPage);
