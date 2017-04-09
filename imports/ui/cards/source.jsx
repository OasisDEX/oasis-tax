import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';


import Picker from '../lists/picker'
import Services from "../lists/services";
import InputGroup from "../elements/item_input";


export default class Source extends Component {

    constructor(props){
        super(props);
        this.state = {
            pickedService: { id: 0, name: 'ethereum', type: 'address', url: 'oasisdex.com' },
        };
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Source
                </div>
                <Services services={this.props.services} removeAccount={this.removeAccount.bind(this)}/>
                <Picker defaultService={this.state.pickedService} changePlaceHolderText={this.changePlaceHolder.bind(this)}/>

                <div className="panel-body">
                <InputGroup placeHolder={"Enter " + this.state.pickedService.name + " " + this.state.pickedService.type} handleSubmit={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }

    removeAccount(accRemov){


       let service = this.props.services.filter((accounts) => accounts.type === accRemov.provider)[0];
        service.accounts.map( (account,index) => {
            if(account.name === accRemov.name){
                service.accounts.splice(index,1);
            }
        });

        let changedServices = this.props.services;

        this.props.changeState(changedServices);

    }

    changePlaceHolder(service){
        let newService = update(this.state.pickedService, {
            id: {$set: service.id},
            name: {$set: service.name},
            type: {$set: service.type},
            url: {$set: service.url},
        });

        this.setState({pickedService: newService});
    }

    handleSubmit(accountName) {

        let serviceName = this.state.pickedService.name;

        let service = this.props.services.filter((service) => service.type === serviceName);
        let serviceAccounts = service[0].accounts.filter( (account) => account.name === accountName);

        if(serviceAccounts.length === 0){

            let account = {
                name: accountName,
                provider: serviceName,
            };
            service[0].accounts.push(account);
            let la = this.props.services;
            this.props.changeState(la);
        }else{
            alert("duplicate");
        }



    }


}

Source.PropTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            accounts: PropTypes.array.isRequired,
            type: PropTypes.string.isRequired,
    })).isRequired,
    changeState: PropTypes.func.isRequired,

};
