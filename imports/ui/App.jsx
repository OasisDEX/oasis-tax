import React, { Component, PropTypes } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

import Web3 from 'web3';
import update from 'react-addons-update';
import Source from "./cards/source";
import Export from './cards/export';
import Services from "./lists/services";


export default class App extends Component {


    constructor(props){
        super(props);

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("new");
        }

    }

    render() {

        const InterfaceHome = () => (
            <div>
                <Source services={this.props.services} changeState={this.changeState.bind(this)} />
                <Export services={this.props.services}/>
                <Link to={'/payment'}>
                    <button type="button" className="btn btn-primary btn-generate">Generate</button>
                </Link>
            </div>
        );

        const CardGenerate = () => (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Generate Report
                </div>
                <Services services={this.props.services} removeAccount={this.changeState.bind(this)}/>
            </div>
        );

        const CardPayment = () => (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Payment
                </div>
            </div>
        );

        const InterfacePayment = () => (
            <div>
            {CardGenerate()}
            {CardPayment()}
            <button type="button" className="btn btn-primary btn-generate">Download</button>
                <Link to={'/'}>
                <button type="button" className="btn btn-primary btn-back">Back</button>
            </Link>
            </div>
        );

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
                    <Route exact path="/" component={InterfaceHome}/>
                    <Route  path="/payment" component={InterfacePayment}/>
                </div>

                </div>
            </Router>
        );

    }

    changeState(service){
        this.setState({
            services: service,
        });
    }



    handleEvent(){

        let address = this.props.user_input[0].text;
        let abi = [{"constant":false,"inputs":[{"name":"haveToken","type":"address"},{"name":"wantToken","type":"address"},{"name":"haveAmount","type":"uint128"},{"name":"wantAmount","type":"uint128"}],"name":"make","outputs":[{"name":"id","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"last_offer_id","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancel","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOffer","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"},{"name":"maxTakeAmount","type":"uint128"}],"name":"take","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"close_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lifetime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"isActive","outputs":[{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"offers","outputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"},{"name":"owner","type":"address"},{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isClosed","outputs":[{"name":"closed","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"buy","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"}],"name":"offer","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"lifetime_","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"ItemUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sell_how_much","type":"uint256"},{"indexed":true,"name":"sell_which_token","type":"address"},{"indexed":false,"name":"buy_how_much","type":"uint256"},{"indexed":true,"name":"buy_which_token","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogMake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":true,"name":"taker","type":"address"},{"indexed":false,"name":"takeAmount","type":"uint128"},{"indexed":false,"name":"giveAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogTake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogKill","type":"event"}];

        let MyContract = web3.eth.contract(abi);
        let myContractInstance = MyContract.at('0x9Ad57b0FA24B7176623c0ACc6f53E56fA15bF5Ad');

        // watch for an event with {some: 'args'}
        let myEvent = myContractInstance.LogTake({taker: address,}, {fromBlock: 0, toBlock: 'latest'});
        myEvent.watch((error, result) => {});


        // would get all past logs again.
        myEvent.get( (error, logs) => {

            for(let i in logs){

                let timestamp = new Date(logs[i].args.timestamp * 1000).toLocaleString();

                giveAmount = logs[i].args.giveAmount;
                giveAmount = giveAmount.toString(10);
                giveAmount = web3.fromWei(giveAmount);

                takeAmount = logs[i].args.takeAmount;
                takeAmount = takeAmount.toString(10);
                takeAmount = web3.fromWei(takeAmount);

                trade = {
                    'Type'     : 'Trade',
                    'Buy'      : giveAmount,
                    'Buy_Cur.' : live[logs[i].args.wantToken],
                    'Sell'     : takeAmount,
                    'Sell_Cur.': live[logs[i].args.haveToken],
                    'Fee'      : '',
                    'Fee_Cur.' : '',
                    'Exchange' : exchanges[0],
                    'Group'    : '',
                    'Comment'  : '',
                    'Date'     : timestamp,
                };

                this.setState( (state) =>
                    update(state, {buys: {$push: [trade]}}));
            }
            console.log(this.state);

            //  JSONToCSVConvertor(this.trades.buys, "TokenTax-Report", true);
        });
    }

}

App.PropTypes = {
    buys: PropTypes.array.isRequired,
    sells: PropTypes.array.isRequired,
    services: PropTypes.arrayOf(
        PropTypes.shape({
            accounts: PropTypes.array.isRequired,
            type: PropTypes.string.isRequired,
        })).isRequired,
};



function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    var header = ["Type","Buy","Cur.","Sell","Cur.","Fee","Cur.", "Exchange","Comment","Date"];

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    console.log(arrData);
    var CSV = '';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in header) {

            //Now convert each value to string and comma-seprated
            row += '"' + header[index] + '",' ;
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}