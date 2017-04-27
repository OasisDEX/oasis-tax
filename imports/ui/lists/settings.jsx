import React, { Component, PropTypes } from 'react';

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
                <li className="list-group-item" key={option.option}>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox"
                                   value={option.id}
                                   onChange={this.clicked.bind(this)}
                                   defaultChecked={option.active}
                            />
                            {option.option}
                        </label>
                    </div>
                </li>
            );
    }

    clicked(event){
        console.log(event.target.value);
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
                    option: PropTypes.string.isRequired,
                })
            ).isRequired
        })).isRequired,
};