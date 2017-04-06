import React, { Component, PropTypes } from 'react';

Sources = [
    { id: 0, name: 'ethereum', type: 'address', url: 'oasisdex.com' },
    { id: 1, name: 'steem', type: 'username', url: 'steemit.com' },
    { id: 2, name: 'bitshares', type: 'username', url: 'bitshares.org' },
];
export default class Picker extends Component {

    constructor(props){
        super(props);
        this.state = {
            sources: Sources,
            selectedOption: 0,

        };
    }

    render() {
        return (

            <ul className="list-group picker-container">
                <form>

            { this.state.sources.map((source) => (
                <li className="list-group-item" key={source.id}>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            value={source.id}
                            checked={this.state.selectedOption == source.id }
                            onChange={this.handleOptionChange.bind(this)}
                        />
                        <span className="picker-label">{source.name}</span>
                    </label>
                </div>
                </li>
            ))}
                </form>
            </ul>
        );
    }

    handleOptionChange(event){
        console.log(event.target.value);
        this.setState({
            selectedOption: event.target.value
        });
        service = this.state.sources[event.target.value];
        this.props.changePlaceHolderText(service);
    }

}

Picker.PropTypes = {
    defaultService: PropTypes.string.isRequired,
    changePlaceHolderText: PropTypes.func.isRequired,

};


