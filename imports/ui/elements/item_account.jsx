import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Account extends Component {


    render(){
          return(
              <li className="list-group-item">
                <div className="row">
                <div className="col-xs-12 col-md-2">
                        <span className="account-item-service">{this.checkVisibility()}</span>
                </div>
                <div className="col-xs-12 col-md-10 npl">
                <div className="col-xs-11 col-md-11">
                                                <span
                                                    className="account-item-name"
                                                    ref={(accountName) => this.accountName = accountName}
                                                >{this.props.account.name}
                                             </span>
            </div>
            <div className="col-xs-1 col-md-1">
                <button
                    className="delete"
                    onClick={this.deleteAccount.bind(this)}
                >
                    &times;
                </button>
            </div>
        </div>
    </div>
</li>);

}
    checkVisibility(){
        if(this.props.providerIsVisible){
            return this.props.account.provider;
        }
    }

    deleteAccount(){
        this.props.removeAccount(this.props.account);
    }

}

Account.PropTypes = {
    account: PropTypes.object.isRequired,
    removeAccount: PropTypes.func.isRequired,
    providerIsVisible: PropTypes.bool.isRequired,
};