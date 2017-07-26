import React, {Component} from 'react';
import Picker from '../components/picker'
import Services from "../components/services";
import InputGroup from "../components/item_input";
import Provider from "../providers";
import PropTypes from 'prop-types';
import {addAccount,removeAccount} from "../actions/userActions";
import { connect } from "react-redux";

class Source extends Component {

    constructor(props){
        super(props);
        this.state = {
            active: 0,
        };
    }

    render() {
        return (
            this.renderElements()
        );
    }

    renderElements(){

        let placeHolder = "Enter " + Provider[this.state.active].name + " " + Provider[this.state.active].type;

        return(
            <div className="panel panel-default">

                <div className="panel-heading">
                    Source
                </div>

                <Services
                    accounts={this.props.accounts}
                    providers={Provider}
                    removeAccount={this.props.removeAccount}
                />

                <Picker
                    services={Provider}
                    active={this.state.active}
                    changePlaceHolderText={this.changePlaceHolder.bind(this)}/>

                <div className="panel-body">
                    <InputGroup
                        placeHolder={placeHolder} handleSubmit={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }

    changePlaceHolder(selectedSource){
        this.setState({active: selectedSource});

    }

    handleSubmit(accountName) {
            let account = {
                name: accountName,
                providerName: Provider[this.state.active].name,
                trades: [],
            };
            this.props.addAccount(account);
    }


}

Source.PropTypes = {
    accounts: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        accounts: state.user.accounts,
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        addAccount: (name) => {
            dispatch(addAccount(name));
        },
        removeAccount: (name) => {
            dispatch(removeAccount(name));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Source);



