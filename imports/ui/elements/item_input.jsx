import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';


export default class InputGroup extends Component {

    render(){
        return (
            <div className="row">
                <form onSubmit={this.handleInputSubmit.bind(this)} >
                    <div className="input-group input-group-lg">
                        <input
                            type="text"
                            className="form-control input-add"
                            ref={(textInput) => { this.textInput = textInput }}
                            placeholder={this.props.placeHolder}
                        >
                        </input>
                        <span className="input-group-btn">
                                          <button
                                              className="btn btn-default add"
                                              type="submit"
                                          >Add
                                          </button>
                                        </span>
                    </div>
                </form>
            </div>
        );

    }

    handleInputSubmit(event){
        event.preventDefault();

        // Find the text field via the React ref
        const inputValue = ReactDOM.findDOMNode(this.textInput).value.trim();
        ReactDOM.findDOMNode(this.textInput).value = '';

        if(inputValue.length > 0 ){
        this.props.handleSubmit(inputValue);
        }
    }

}

InputGroup.PropTypes = {
    placeHolder: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};