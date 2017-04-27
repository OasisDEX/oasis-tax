import React, {Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Settings from "../lists/settings";
import InputGroup from "../elements/item_input";
import ListItemEmail from "../elements/item_email";

export default class Export extends Component {


    render(){
        return (
            <div className="panel panel-default">
            <div className="panel-heading">
                Export Settings
            </div>
                <Settings services={this.props.services}/>
                {this.renderEmailItem()}
                <div className="panel-body">
                    <InputGroup placeHolder={"Enter Email Address "} handleSubmit={this.addEmail.bind(this)}/>
                </div>
        </div>);
    }

    renderEmailItem(){
        if(this.props.email.length > 0 ){
            return (
                <ul className="list-group picker-container">
                    <ListItemEmail
                        email={this.props.email}
                    />
                </ul>
            );
        }
    }

    addEmail(newEmail){
        this.props.updateEmail(newEmail);
    };

}




Export.PropTypes = {
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
    updateEmail: PropTypes.func.isRequired,

};
