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
        let service = this.props.services.filter((service) => service.type === 'ethereum');
            if (service[0].accounts.length > 0 ) {
                hasEthereum = true;
            }

        return hasEthereum;
    }

    renderEthereumSettings() {
        if(this.checkEthereum()) {
            return (
                <ul className="list-group export">
                    { settingsETH.map((setting) => (
                        <li className="list-group-item" key={setting.id}>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox"
                                           value=""
                                           defaultChecked={setting.id === 0}
                                    />
                                    {setting.option}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }
    }

}



Settings.PropTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            accounts: PropTypes.array.isRequired,
            type: PropTypes.string.isRequired,
        })).isRequired,
};