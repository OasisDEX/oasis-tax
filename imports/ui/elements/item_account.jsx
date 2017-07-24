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
                <div className="col-xs-11 col-md-10">
                                                <span
                                                    className="account-item-name"
                                                    ref={(accountName) => this.accountName = accountName}
                                                >{this.props.account.name}
                                                </span>
            </div>
                {this.isRemovable()}
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

    isRemovable(){
        if(this.props.removeAccount === undefined){
            return (
                <div className="col-xs-1 col-md-1">
                {this.isLoading()}
                </div>);
        }else {
            return (
            <div className="col-xs-1 col-md-1">
                <button
                    className="delete"
                    onClick={this.deleteAccount.bind(this)}
                >
                    &times;
                </button>
            </div>
               );
        }
    }

    isLoading(){
        if(this.props.isLoading){
            return (<img src="ic_loading_24px.svg"></img>);
        }else {
            return (<img src="ic_done_24px.svg"></img>);
        }
    }

}

Account.PropTypes = {
    account: PropTypes.object.isRequired,
    providerIsVisible: PropTypes.bool.isRequired,
};