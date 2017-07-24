import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Settings from "../lists/settings";
import InputGroup from "../elements/item_input";
import ListItemEmail from "../elements/item_email";
import {setEmail,enableOption,disableOption} from "./../actions/settingsActions";
import { connect } from "react-redux";


class Export extends Component {


    render(){
        return (
            <div className="panel panel-default">
            <div className="panel-heading">
                Export Settings
            </div>
                <Settings settings={this.props.settings}/>
                {this.renderEmailItem()}
                <div className="panel-body">
                    <InputGroup placeHolder={"Enter Email Address "} handleSubmit={this.handleEmail.bind(this)}/>
                </div>
        </div>);
    }

    renderEmailItem(){
            return (
                <ul className="list-group picker-container">
                    <ListItemEmail
                        email={this.props.email}
                    />
                </ul>
            );
    }

    handleEmail(email){
        this.props.setEmail(email);
    };

}


const mapStateToProps = (state) => {
    return {
        settings: state.settings,
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        enableOption: (option) => {
            dispatch(enableOption(option));
        },
        disableOption: (option) => {
            dispatch(disableOption(name));
        },
        setEmail: (email) => {
            dispatch(setEmail(email));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Export);

