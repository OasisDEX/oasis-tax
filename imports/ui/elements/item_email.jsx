import React, {Component, PropTypes} from 'react';

export default class ListItemEmail extends Component {


    render(){
        return(
            <li className="list-group-item">
                <div className="row">
                    <div className="col-xs-12 col-md-2">
                        <span className="account-item-service">Email</span>
                    </div>
                    <div className="col-xs-12 col-md-10 npl">
                        <div className="col-xs-11 col-md-11">
                                                <span
                                                    className="account-item-name"
                                                >{this.props.email}
                                             </span>
                        </div>
                    </div>
                </div>
            </li>);

    }


    deleteAccount(){
        console.log("delete Account: " + this.props.email);
    }

}

ListItemEmail.PropTypes = {
    email: PropTypes.string.isRequired,

};