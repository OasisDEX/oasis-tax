import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Option from "../elements/item_option";


export default class Settings extends Component {

    render(){
        return (
                <ul className="list-group export">
                {this.renderServices()}
                </ul>
        );
    }


    renderServices() {
        return this.props.services.map((service) => this.renderOptions(service));
        }

    renderOptions(service){
        if (service.accounts.length > 0 ) {
            return service.options.map((options) => this.renderOption(options));
        }
    }

    renderOption(option){
        return (
                <Option
                    option={option}
                />
            );
    }

}



Settings.PropTypes = {
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
};