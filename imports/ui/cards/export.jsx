import React, {Component, PropTypes } from 'react';

import Settings from "../lists/settings";


export default class Export extends Component {

    render(){
        return (<div className="panel panel-default">
            <div className="panel-heading">
                Export Settings
            </div>
            <Settings accounts={this.props.accounts}/>
            <div className="panel-body">
                <div className="row">

                    <div className="input-group input-group-lg">
                        <input
                            type="text"
                            className="form-control input-add"
                            placeholder={'Enter Email Address'}>
                        </input>
                        <span className="input-group-btn">
                            <button
                                className="btn btn-default add"
                                type="button"
                            >Add
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>);
    }

}

Export.PropTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        provider: PropTypes.string.isRequired,
    })).isRequired,
};