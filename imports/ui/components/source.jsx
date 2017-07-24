import React, {Component} from 'react';
import Picker from '../lists/picker'
import Services from "../lists/services";
import InputGroup from "../elements/item_input";
import Provider from "../providers";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {addAccount} from "../../ui/actions/userActions"



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

        console.log(this.props.accounts);
        let placeHolder = "Enter " //+ this.props.user.providers[this.state.active].name + " " + this.props.user.providers[this.state.active].type;

        return(
            <div className="panel panel-default">

                <div className="panel-heading">
                    Source
                </div>

                <Services
                    accounts={this.props.accounts}
                    providers={Provider}
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


    removeAccount(accRemov){
        console.log(accRemov);

        console.log("without filter Service");
        console.log(this.props.services);

         let service = this.props.services.filter((service) => service.provider === accRemov.provider)[0];
         console.log("filtered Service");
         console.log(service);

         service.accounts.map( (account,index) => {
             if(account.name === accRemov.name){
                 service.accounts.splice(index,1);
             }
         });

        console.log("removed Account");

         let changedServices = this.props.services;
        console.log(changedServices);
         this.props.changeState(changedServices,this.state.active);

    }


    changePlaceHolder(selectedSource){
        this.setState({active: selectedSource});

    }

    handleSubmit(accountName) {
            let account = {
                name: accountName,
                providerName: Provider[this.state.active],
                trades: [],
            };
            this.props.addAccount(account);
    }


}
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
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Source);


