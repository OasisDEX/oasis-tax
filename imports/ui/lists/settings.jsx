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
        return this.props.settings.options.map((option) => this.renderOption(option));
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
    settings: PropTypes.array.isRequired
};