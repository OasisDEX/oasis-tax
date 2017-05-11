import React, {Component}  from 'react';
import Services from './../lists/services';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import config from './../config.json';
import { createContainer } from 'meteor/react-meteor-data';
import { HTTP } from 'meteor/http'
import BN from 'bn.js';
import EthUtils from 'ethereumjs-util';
import Web3 from 'web3';

export class GenerateReportPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            csv : this.initCSVHeader(),
            oasis: GenerateReportPage.getSimpleMarketContract().at(config.market.live.address),
            hasPayed: false,
            isLoading: false,

    };
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("new");
        }
    }

    render(){
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Generate Report
                    </div>
                    <Services
                        services={this.props.services}
                        isLoading={this.state.isLoading}
                    />
                </div>

                <div>
                    {this.generateButton()}
                    <Link to={'/'}>
                        <button type="button" className="btn btn-primary btn-back">Back</button>
                    </Link>
                </div>
            </div>
        );

    }

    generateButton(){
        if(this.state.hasPayed){
            return (
                <button
                    type="button"
                    onClick={this.downloadCSV.bind(this)}
                    className="btn btn-primary btn-generate">Download
                </button>);
        }else {
            return (
                <button
                    type="button"
                    onClick={this.fetchTrades.bind(this)}
                    className="btn btn-primary btn-download">Generate
                </button>);
        }
    }



    static getSimpleMarketContract(){
        let abi = [{"constant":false,"inputs":[{"name":"haveToken","type":"address"},{"name":"wantToken","type":"address"},{"name":"haveAmount","type":"uint128"},{"name":"wantAmount","type":"uint128"}],"name":"make","outputs":[{"name":"id","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"last_offer_id","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancel","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOffer","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"},{"name":"maxTakeAmount","type":"uint128"}],"name":"take","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"close_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lifetime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"isActive","outputs":[{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"offers","outputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"},{"name":"owner","type":"address"},{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isClosed","outputs":[{"name":"closed","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"buy","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"}],"name":"offer","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"lifetime_","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"ItemUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sell_how_much","type":"uint256"},{"indexed":true,"name":"sell_which_token","type":"address"},{"indexed":false,"name":"buy_how_much","type":"uint256"},{"indexed":true,"name":"buy_which_token","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogMake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":true,"name":"taker","type":"address"},{"indexed":false,"name":"takeAmount","type":"uint128"},{"indexed":false,"name":"giveAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogTake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogKill","type":"event"}];
        return web3.eth.contract(abi);
    }

    fetchTrades(){
        console.log("fetchTrades");

        this.setState({
            isLoading: true,
        });

        let accounts = this.props.services[0].accounts;

        for(let i = 0; i < accounts.length; i++) {
            const fetchIssuedTrades = this.fetchIssuedTradesFor(accounts[i]);
            const fetchAcceptedTrades = this.fetchAcceptedTrades(accounts[i]);
            const fetchLegacyTrades = this.fetchLegacyTrades(accounts[i]);

            Promise.all([fetchIssuedTrades, fetchAcceptedTrades, fetchLegacyTrades]).then( () => {
                this.setState({
                    isLoading: false,
                    hasPayed: true,
                });

            });
        }
    }

    fetchLegacyTrades(address){
        return new Promise( (resolve, reject) => {
            for (let j = 2; j < 15; j++) {
                HTTP.get(Meteor.absoluteUrl("/maker-otc-" + j + ".trades.json"), (err, result) => {
                    let data = result.data;
                    for (let i = 0; i < data.length; i++) {
                        const maker = EthUtils.addHexPrefix(data[i].taker);
                        if ( maker ===  address.name) {
                            console.log(data[i]);
                            this.addTrade(address, data[i]);
                        }
                    }

                });
            }
            resolve();
        });
    }

    fetchAcceptedTrades(address){
        return new Promise((resolve, reject) => {
            this.state.oasis.LogTake({maker: address.name}, {
                fromBlock: config.market.live.blockNumber,
                toBlock: 'latest'}).get( (error, makeLogs) => {
                if(!error){
                    for(let i=0;i < makeLogs.length; i++){
                        this.addTrade(address, makeLogs[i].args);
                    }
                    resolve();
                }else {
                    console.debug('Cannot fetch issued trades');
                    reject();
                }
            });
        });
    }

    fetchIssuedTradesFor(address) {
        return new Promise((resolve, reject) => {
            this.state.oasis.LogTake({taker: address.name}, {
                fromBlock: config.market.live.blockNumber,
                toBlock: 'latest'}).get( (error, takeLogs) => {
                if(!error){
                    for(let i = 0; i < takeLogs.length; i++){
                        this.addTrade(address, takeLogs[i].args);
                    }
                    resolve();
                }else {
                    console.debug('Cannot fetch issued trades');
                    reject();
                }
            });
        });
    }

    addTrade(account, log){

        let giveAmount;
        let takeAmount;
        let haveTokenAddress;
        let wantTokenAddress;

        console.log(log);

                //if legacy markets
                if ( typeof log.giveAmount === 'string' ){
                    giveAmount = web3.fromWei(new BN(log.giveAmount, 16).toString(10));
                    takeAmount = web3.fromWei(new BN(log.takeAmount, 16).toString(10));

                    haveTokenAddress = EthUtils.addHexPrefix(log.giveAmount);
                    wantTokenAddress = EthUtils.addHexPrefix(log.takeAmount);
                }else{
                    giveAmount = web3.fromWei(log.giveAmount.toString(10));
                    takeAmount = web3.fromWei(log.takeAmount.toString(10));

                    haveTokenAddress = log.haveToken;
                    wantTokenAddress = log.wantToken;
                }



        let timestamp = new Date(log.timestamp * 1000).toLocaleString();

        const wantToken = config.tokens.live[wantTokenAddress];
        const haveToken = config.tokens.live[haveTokenAddress];

        console.log(wantTokenAddress);
        console.log(haveTokenAddress);

        let trade = {
            'Type'     : 'Trade',
            'Buy'      : giveAmount,
            'Buy_Cur' : wantToken,
            'Sell'     : takeAmount,
            'Sell_Cur': haveToken,
            'Fee'      : '',
            'Fee_Cur' : '',
            'Exchange' : '',
            'Group'    : '',
            'Comment'  : account.name,
            'Date'     : timestamp,
        };

        //add trade to CSV
        this.JSONToCSVConverter(trade);

        account.trades.push(trade);
        let newService = this.props.services;
        this.props.addAccount(newService);
    }

    initCSVHeader(){

        let header = config.csv.header;

        let CSV = '';
        let row = '';

            for (let i in header) {
                row += '"' + header[i] + '",' ;
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';

        return CSV;
    }

    JSONToCSVConverter(JSONData) {

        let csvEdited = this.state.csv;
        let row = '';

        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            //2nd loop will extract each column and convert it in string comma-seprated
            for (let i in arrData) {
                row += '"' + arrData[i] + '",';
            }

            row = row.slice(0, row.length - 1);

            //add a line break after each row
            csvEdited += row + '\r\n';

        this.setState({
            csv: csvEdited,
        });

    }

    downloadCSV() {

        console.log(this.state.csv);
        const fileName = config.csv.title;


        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.state.csv);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        const link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}



export default createContainer(({services}) => {
    return {
        services: services,
    }
}, GenerateReportPage);

GenerateReportPage.PropTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            accounts: PropTypes.array.isRequired,
            provider: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    active: PropTypes.bool.isRequired,
                    option: PropTypes.string.isRequired,
                })
            ).isRequired
        })).isRequired,
    addAccount: PropTypes.func.isRequired,
};