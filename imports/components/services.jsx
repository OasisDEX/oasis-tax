import React, {Component} from 'react';
import PropTypes from 'prop-types';


import Account from "./item_account";


export default class Services extends Component {

    render() {
        return (
               <ul className="list-group">
                    {this.renderServices()}
                </ul>
        );

    }

    renderServices(){
        return Object.keys(this.props.providers)
            .map((key) => this.props.providers[key])
            .map((providers) => providers.accounts.map((account,index)=> this.renderAccount(account,index)));
    }


    renderAccount(account,index){
        return (
            <Account account={account}
                     key={index}
                     providerIsVisible={ index === 0}
                     removeAccount={this.props.removeAccount}
            />
        );
    }
}

Services.PropTypes = {
    providers: PropTypes.object.isRequired,
    selectedProvider: PropTypes.number,
    isLoading: PropTypes.bool,
    removeAccount: PropTypes.func,
};

