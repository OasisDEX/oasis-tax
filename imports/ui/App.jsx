import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { connect } from "react-redux";
import Source from "./container/source";
import Export from "./container/export";


class App extends Component {
    render() {
        return (
                <div className="container">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="#">Token.tax</a>
                                <a className="navbar-brand" href="#">a Dapphub.com Service</a>
                            </div>
                        </div>
                    </nav>
                <Source/>
                <Export/>
                </div>
        );
    }
}

export default connect()(App);

