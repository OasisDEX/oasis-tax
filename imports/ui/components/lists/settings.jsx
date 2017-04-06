import React, { Component, PropTypes } from 'react';

const settingsETH = [
    { id: 0, active: true, option: 'Load data from Oasis (https://oasisdex.com)'},
    { id: 1, active: false, option: 'Load data from Etherdelta (https://ether.delta)'}
];

export default class Settings extends Component {

    render(){
        return (
                <ul className="list-group">
                {this.renderEthereumSettings()}
                </ul>
        );
    }

    checkEthereum(){
        var hasEthereum = false;
        this.props.accounts.map( (account) => {
            if (account.provider === 'Ethereum') {
                console.log("Provider:" + account.provider);
                hasEthereum = true;
            }
        });
        return hasEthereum;
    }

    renderEthereumSettings() {
        if(this.checkEthereum()) {
            return (
                <ul className="list-group">
                    { settingsETH.map((setting) => (
                    <li className="list-group-item" key={setting.id}>
                            <input
                                type="checkbox"
                                name='data-layer-group'
                                defaultChecked={setting.active}
                            />
                            <span className="text">{setting.option}</span>
                        </li>
                    ))}
                </ul>
            );
        }
    }

}



Settings.PropTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        provider: PropTypes.string.isRequired,
    })).isRequired,
};