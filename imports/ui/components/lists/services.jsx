import React, {Component, PropTypes} from 'react';

import Account from "../elements/item_account";


export default class Services extends Component {

    render() {
        return (
                <ul className="list-group">
                    {
                        this.props.services.map((service, index) => (
                            service.accounts.map((account, index) => (
                            <Account account={account}
                                     removeAccount={this.props.removeAccount}
                                     key={index}
                                     providerIsVisible={this.isVisible(index)}
                            />
                            ))
                        ))
                    }
                </ul>
        );

    }

    isVisible(index){
        if(index === 0){
            return true;
        }else {
            return false;
        }
    }
}

Services.propTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            accounts: PropTypes.array.isRequired,
            type: PropTypes.string.isRequired,
        })).isRequired,
    removeAccount: PropTypes.func.isRequired,

};