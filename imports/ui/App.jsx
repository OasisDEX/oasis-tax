import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Web3 from 'web3';
import { createContainer } from 'meteor/react-meteor-data';
import ConfigurationPageContainer from './pages/ConfigurationPageContainer';
import GenerateReportPageContainer from './pages/GenerateReportPageContainer';

const history = createBrowserHistory();


export class App extends Component {

    constructor(props){
        super(props);

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("new");
        }

        this.state = {
            active: 0,
            trades: [],
            services: [
                {
                    id: 0,
                    accounts: [],
                    provider: 'ethereum',
                    type: 'address',
                    url: 'oasisdex.com',
                    options: [
                        { active: true, option: 'Load data from Oasis (https://oasisdex.com)'},
                        { active: false, option: 'Load data from Etherdelta (https://ether.delta)'},
                             ]
                },
                {
                    id: 1,
                    accounts: [],
                    provider: 'steem',
                    type: 'username',
                    url: 'steemit.com',
                    options: []
                },
                {
                    id: 2,
                    accounts: [],
                    provider: 'bitshares',
                    type: 'username',
                    url: 'bitshares.org',
                    options: [
                        { active: false, option: 'Alias IOU assets on Bitshares'},
                ]},
            ],
            email: '',
        };
    }

    render() {
        return (
            <Router history={history}>
                <div>

                <div className="container">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="#">Token.tax</a>
                                <a className="navbar-brand" href="#">a Dapphub.com Service</a>
                            </div>

                        </div>
                    </nav>
                    <Route
                        exact path="/"
                        render={() =>
                            (<ConfigurationPageContainer
                                active={this.state.active}
                                email={this.state.email}
                                services={this.state.services}
                                changeState={this.changeState.bind(this)}
                                updateEmail={this.updateEmail.bind(this)}
                            />)}
                    />
                    <Route
                        path="/payment"
                        render={() =>(
                            <GenerateReportPageContainer
                                services={this.state.services}
                            />
                        )}/>
                </div>

                </div>
            </Router>
        );

    }

    changeState(service,pickedService){
        this.setState({
            services: service,
            active: pickedService,
        });
    }

    updateEmail(newEmail){
        this.setState({
            email: newEmail,
        });
    }


}

export default AppContainer = createContainer(props => { return {}; }, App);
