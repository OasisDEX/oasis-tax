import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Picker extends Component {

    render() {
        return (
            <ul className="list-group picker-container">
                <form>
                    {this.renderElements()}
                </form>
            </ul>
        );
    }

    renderElements(){
        return Object.keys(this.props.providers)
            .map((key) => this.props.providers[key]).map((provider,index) => this.renderElement(provider));
    }

    renderElement(provider){
        return(
            <li className="list-group-item" key={provider.name}>
            <div className="radio">
                <label>
                    <input
                        type="radio"
                        value={provider.name}
                        name="myGroupName"
                        checked={this.props.active === provider.name}
                        onChange={() => this.props.setActiveItem(provider.name)}
                    />
                    <span className="picker-label">{provider.name}</span>
                </label>
            </div>
        </li>
        );
    }
}

Picker.PropTypes = {
    providers: PropTypes.object.isRequired,
    active: PropTypes.number.isRequired,
    setActiveItem: PropTypes.func.isRequired,

};


