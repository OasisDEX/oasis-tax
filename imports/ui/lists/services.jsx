import React, {Component} from 'react';
import PropTypes from 'prop-types';


import Account from "../elements/item_account";


export default class Services extends Component {

    render() {
        return (
               <ul className="list-group">
                    {this.renderServices()}
                </ul>
        );

    }

    renderServices(){
        return Object.keys(this.props.accounts)
            .map((key) => this.props.accounts[key]
                .map( (account,index) => this.renderAccount(account,index)));
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
    accounts: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    selectedProvider: PropTypes.number,
    isLoading: PropTypes.bool,
    removeAccount: PropTypes.func,
};

