import React, {Component} from 'react';
import Picker from '../components/picker'
import Services from "../components/services";
import InputGroup from "../components/item_input";
import {addAccount,removeAccount} from "../actions/providersActions";
import {setPicker} from "../actions/settingsActions"
import { connect } from "react-redux";

class Source extends Component {

    render() {
        return (
            this.renderElements()
        );
    }

    renderElements(){

        let placeHolder = "Enter " + this.props.activeProvider + " " + this.props.providers[this.props.activeProvider].type;

        return(
            <div className="panel panel-default">

                <div className="panel-heading">
                    Source
                </div>

                <Services
                    providers={this.props.providers}
                    removeAccount={this.props.removeAccount}
                />

                <Picker
                    providers={this.props.providers}
                    active={this.props.activeProvider}
                    setActiveItem={this.props.setPicker}/>

                <div className="panel-body">
                    <InputGroup
                        placeHolder={placeHolder} handleSubmit={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }


    handleSubmit(accountName) {
            this.props.addAccount(
                {
                name: accountName,
                provider: this.props.activeProvider,
                trades: []
                }
            );
    }


}

const mapStateToProps = (state) => {
    return {
        providers: state.providers,
        activeProvider: state.settings.activeProvider
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
        setPicker: (provider) => {
            dispatch(setPicker(provider));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Source);



