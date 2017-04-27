import React, {Component, PropTypes} from 'react';

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
                    option: PropTypes.string.isRequired,
                })
            ).isRequired
        })).isRequired,
    removeAccount: PropTypes.func,
};