import React, { Component } from 'react';
import PropTypes from 'prop-types';



export default class Picker extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedOption: props.active,
        };
    }

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
        return this.props.services.map((service) => (this.renderElement(service)));
    }

    renderElement(service){
        return(
            <li className="list-group-item" key={service.id}>
            <div className="radio">
                <label>
                    <input
                        type="radio"
                        value={service.id}
                        name="myGroupName"
                        checked={this.state.selectedOption == service.id}
                        onChange={this.handleOptionChange.bind(this)}
                    />
                    <span className="picker-label">{service.provider}</span>
                </label>
            </div>
        </li>
        );
    }

    handleOptionChange(event){

        this.setState({
            selectedOption:  event.target.value
        });
        this.props.changePlaceHolderText(event.target.value);
    }

}

Picker.PropTypes = {
    active: PropTypes.number.isRequired,
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
    changePlaceHolderText: PropTypes.func.isRequired,

};


