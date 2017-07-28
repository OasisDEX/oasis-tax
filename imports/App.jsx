import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { connect } from "react-redux";
import Source from "./container/Source";
import Export from "./container/Export";
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Report from "./container/Report";


const history = createBrowserHistory();


class App extends Component {
    render() {
        return (
            <Router history={history}>
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
                        render={Configuration}
                    />

                    <Route
                        path="/payment"
                        component={Report}
                        />

                </div>
            </Router>
        );
    }
}

const Configuration = () => {
    return(
        <div>
            <Source/>
            <Export/>
            <Link to={'/payment'}>
                <button type="button" className="btn btn-primary btn-generate">Next</button>
            </Link>
        </div>
    )
};

export default connect()(App);

