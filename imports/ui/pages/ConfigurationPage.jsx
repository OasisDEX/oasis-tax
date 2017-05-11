import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import Source from "./../components/source";
import Export from './../components/export';

import {Link} from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

export class ConfigurationPage extends Component {
    render(){
       return (
           <div>
               <Source
                   active={this.props.active}
                   services={this.props.services}
                   changeState={this.props.changeState}
               />

               <Export
                   services={this.props.services}
                   email={this.props.email}
                   updateEmail={this.props.updateEmail}
               />

               <Link to={'/payment'}>
                   <button type="button" className="btn btn-primary btn-generate">Next</button>
               </Link>
           </div>
       );

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

ConfigurationPage.PropTypes = {
    active: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    services: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            accounts: PropTypes.array.isRequired,
            provider: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    active: PropTypes.bool.isRequired,
                    option: PropTypes.string.isRequired,
                })
            ).isRequired
        })).isRequired,
    changeState: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
};