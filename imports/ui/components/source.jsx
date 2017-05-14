import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Picker from '../lists/picker'
import Services from "../lists/services";
import InputGroup from "../elements/item_input";
import EthUtils from 'ethereumjs-util';


export default class Source extends Component {

    constructor(props){
        super(props);
        this.state = {
            active: this.props.active,
        };
    }

    render() {
        return (
            this.renderElements()
        );
    }

    renderElements(){

        let placeHolder = "Enter " + this.props.services[this.state.active].provider + " " + this.props.services[this.state.active].type;

        return(
            <div className="panel panel-default">

                <div className="panel-heading">
                    Source
                </div>

                <Services
                    services={this.props.services}
                    removeAccount={this.removeAccount.bind(this)}
                />

                <Picker
                    services={this.props.services}
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

         let service = this.props.services.filter((service) => service.provider === accRemov.provider)[0];

         service.accounts.map( (account,index) => {
             if(account.name === accRemov.name){
                 service.accounts.splice(index,1);
             }
         });

         let changedServices = this.props.services;
        console.log(changedServices);
         this.props.changeState(changedServices,this.state.active);

    }


    changePlaceHolder(selectedSource){
        this.setState({active: selectedSource});

    }

    handleSubmit(accountName) {

        if(EthUtils.isValidAddress(accountName)){
            console.log("not valid");
            let pickedService = this.state.active;
            let serviceName = this.props.services[pickedService].provider;

            let service = this.props.services.filter((service) => service.provider === serviceName);
            let serviceAccounts = service[0].accounts.filter( (account) => account.name === accountName);

            if(serviceAccounts.length === 0){

                let account = {
                    name: accountName,
                    provider: serviceName,
                    trades: [],
                };
                service[0].accounts.push(account);
                let la = this.props.services;

                this.props.changeState(la,pickedService);

            }else{
                alert("duplicate");
            }
        }else {
            this.props.alert();
        }

    }
}

Source.PropTypes = {
    active: PropTypes.number.isRequired,
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
                    name: PropTypes.string.isRequired,
                })
            ).isRequired
    })).isRequired,
    changeState: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,

};
