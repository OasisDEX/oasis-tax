import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Option extends Component {

    constructor(props){
        super(props);
    }

    render(){

        return(
        <li className="list-group-item" key={this.props.option.option}>
            <div className="checkbox">
                <label>
                    <input type="checkbox"
                           onChange={this.clicked.bind(this)}
                           defaultChecked={this.props.option.active}
                    />
                    {this.props.option.name}
                </label>
            </div>
        </li>
        );

    }

    clicked(){
        this.props.option.active = !this.props.option.active;
    }
}



Option.Promise = {
    option: PropTypes.object.isRequired
};