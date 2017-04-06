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

                <Services
                    services={this.props.services}
                    removeAccount={this.removeAccount.bind(this)}/>

                <Picker
                    defaultService={this.state.pickedService.name}
                    changePlaceHolderText={this.changePlaceHolder.bind(this)}
                />

                <div className="panel-body">
                    <InputGroup
                        placeHolder={'Enter ' + this.state.pickedService.name + ' ' + this.state.pickedService.type }
                        handleSubmit={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }

    removeAccount(accRemov){

        let newServices;

        let service = this.props.services.filter((accounts) => accounts.type === accRemov.provider)[0];

        service.accounts.map( (acc,index) => {
            if(acc.name === accRemov.name){
                switch(accRemov.provider) {
                    case 'ethereum':
                        newServices = update(this.props.services, {0: {accounts: {$splice: [[index, 1]]}}});
                        break;
                    case 'steem':
                        newServices = update(this.props.services, {1: {accounts: {$splice: [[index, 1]]}}});
                        break;
                    case 'bitshares':
                        newServices = update(this.props.services, {2: {accounts: {$splice: [[index, 1]]}}});
                        break;
                }
            }
        });
        this.props.removeAccount(newServices);

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
        let account = service[0].accounts.filter( (account) => account.name === accountName);

        if(account.length === 0){

            let account = {
                name: accountName,
                provider: serviceName,
            };

            let newServices;

            switch(serviceName){
                case 'ethereum':
                    newServices = update(this.props.services, {0: { accounts: {$push: [account]}}});
                    break;
                case 'steem':
                    newServices = update(this.props.services, {1: { accounts: {$push: [account]}}});
                    break;
                case 'bitshares':
                    newServices = update(this.props.services, {2: { accounts: {$push: [account]}}});
                    break;
            }
            console.log(newServices);

            this.props.addAccount(newServices);
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
    addAccount: PropTypes.func.isRequired,
    removeAccount: PropTypes.func.isRequired,

};