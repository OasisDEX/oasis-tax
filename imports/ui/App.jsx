import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Web3 from 'web3';
import { createContainer } from 'meteor/react-meteor-data';
import ConfigurationPage from './pages/ConfigurationPage';
import GenerateReportPage from './pages/GenerateReportPage';
import config from './config.json';

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
            services: this.getServicesFromConfigFile(),
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
                            (<ConfigurationPage
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
                            <GenerateReportPage
                                services={this.state.services}
                                addAccount={this.addAccount.bind(this)}
                            />
                        )}/>
                </div>

                </div>
            </Router>
        );

    }


    getServicesFromConfigFile(){

        var jsonArr = [];

        let servicesArr = config.services;

        for (let i = 0; i < config.services.length; i++) {
            jsonArr.push({
                id: i,
                accounts: [],
                provider: servicesArr[i].provider,
                type: servicesArr[i].type,
                url: servicesArr[i].url,
                options: servicesArr[i].options
            });
        }
        return jsonArr
    }

    changeState(service,pickedService){
        this.setState({
            services: service,
            active: pickedService,
        });
    }

    addAccount(services){
        console.log(services);
        this.setState({
            services: services,
        });
    }

    updateEmail(newEmail){
        this.setState({
            email: newEmail,
        });
    }


}

export default AppContainer = createContainer(() => { return {}; }, App);
