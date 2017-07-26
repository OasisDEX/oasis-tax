import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import InputGroup from "../components/item_input";
import ListItemEmail from "../components/item_email";
import {setEmail,inverseOption} from "../actions/settingsActions";
import { connect } from "react-redux";
import ListItemOption from "../components/item_option";


class Export extends Component {
    render(){
        return (
            <div className="panel panel-default">
            <div className="panel-heading">
                Export Settings
            </div>
                <ul className="list-group export">
                    {this.renderServices()}
                </ul>
                {this.renderEmailItem()}
                <div className="panel-body">
                    <InputGroup placeHolder={"Enter Email Address "} handleSubmit={this.handleEmail.bind(this)}/>
                </div>
        </div>);
    }

    renderServices() {
        return this.props.settings.options.map((option) => this.renderOption(option));
    }

    renderOption(option){
        return(
            <ListItemOption
                key={option.id}
                option={option}
                inverseOption={this.invOption.bind(this)}

            />
        );
    }

    invOption(option){
            this.props.inverseOption(option);

    }

    renderEmailItem(){
            return (
                <ul className="list-group picker-container">
                    <ListItemEmail
                        email={this.props.settings.email}
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
        inverseOption: (option) => {
            dispatch(inverseOption(option));
        },
        setEmail: (email) => {
            dispatch(setEmail(email));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Export);

