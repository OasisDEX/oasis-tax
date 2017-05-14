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
        return this.props.services.map((service, index) => this.renderAccounts(service));
    }

    renderAccounts(service){
        return service.accounts.map((account, index) => this.renderAccount(account,index));
    }

    renderAccount(account,index){
        return (
            <Account account={account}
                     removeAccount={this.props.removeAccount}
                     key={index}
                     providerIsVisible={ index === 0}
                     isLoading={this.props.isLoading}
            />
        );
    }
}

Services.propTypes = {
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
    isLoading: PropTypes.bool,
    removeAccount: PropTypes.func,
};