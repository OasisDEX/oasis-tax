import React, {Component}  from 'react';
import Services from './../lists/services';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import config from './../config.json';
import { createContainer } from 'meteor/react-meteor-data';
import { HTTP } from 'meteor/http'
import BN from 'bn.js';
import EthUtils from 'ethereumjs-util';


export class GenerateReportPage extends Component {
    render(){
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Generate Report
                    </div>
                    <Services services={this.props.services}/>
                </div>

                <div className="panel panel-default">
                    <div className="panel-heading">
                        Payment
                    </div>
                </div>

                <button type="button" onClick={this.fetchTrades.bind(this)} className="btn btn-primary btn-generate">Download</button>
                <Link to={'/'}>
                    <button type="button" className="btn btn-primary btn-back">Back</button>
                </Link>

            </div>
        );

    }

    static getSimpleMarketContract(){
        let abi = [{"constant":false,"inputs":[{"name":"haveToken","type":"address"},{"name":"wantToken","type":"address"},{"name":"haveAmount","type":"uint128"},{"name":"wantAmount","type":"uint128"}],"name":"make","outputs":[{"name":"id","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"last_offer_id","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancel","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOffer","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"},{"name":"maxTakeAmount","type":"uint128"}],"name":"take","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"close_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lifetime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"isActive","outputs":[{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"offers","outputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"},{"name":"owner","type":"address"},{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isClosed","outputs":[{"name":"closed","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"buy","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"}],"name":"offer","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"lifetime_","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"ItemUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sell_how_much","type":"uint256"},{"indexed":true,"name":"sell_which_token","type":"address"},{"indexed":false,"name":"buy_how_much","type":"uint256"},{"indexed":true,"name":"buy_which_token","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogMake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":true,"name":"taker","type":"address"},{"indexed":false,"name":"takeAmount","type":"uint128"},{"indexed":false,"name":"giveAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogTake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"},{"indexed":true,"name":"pair","type":"bytes32"},{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"haveToken","type":"address"},{"indexed":false,"name":"wantToken","type":"address"},{"indexed":false,"name":"haveAmount","type":"uint128"},{"indexed":false,"name":"wantAmount","type":"uint128"},{"indexed":false,"name":"timestamp","type":"uint64"}],"name":"LogKill","type":"event"}];
        return web3.eth.contract(abi);
    }

    fetchTrades(){

        let accounts = this.props.services[0].accounts;

        for(let i = 0; i < accounts.length; i++) {
            this.searchLegacyMarkets(accounts[i]);
            this.searchEventfulMarkets(accounts[i]);
        }

    }

    searchEventfulMarkets(account){
        let oasis = GenerateReportPage.getSimpleMarketContract().at(config.market.live.address);

        let allTakeEvents = oasis.LogTake({taker: account.name,}, {fromBlock: config.market.live.blockNumber, toBlock: 'latest'});

        //  allTakeEvents.watch((error, result) => {});

        allTakeEvents.get( (error, logs) => {
            for(let index in logs){
                this.addTrade(account, logs[index] );
            }
        });

    }

    searchLegacyMarkets(account){

        for (let j = 2; j < 15; j++) {
            HTTP.get(Meteor.absoluteUrl("/maker-otc-" + j + ".trades.json"), (err, result) => {
                let data = result.data;
                for (let i = 0; i < data.length; i++) {
                    const maker = EthUtils.addHexPrefix(data[i].maker);
                    if ( maker ===  account.name || data[i].taker === account.name) {
                        console.log(data[i]);
                        this.addTradeFromLegacyMarkets(account, data[i]);
                    }
                }

            });
        }
    }

    addTradeFromLegacyMarkets(account, log){
        let timestamp = new Date(log.timestamp * 1000).toLocaleString();



        giveAmount = web3.fromWei(new BN(log.giveAmount, 16).toString(10));
        takeAmount = web3.fromWei(new BN(log.takeAmount, 16).toString(10));

        const wantToken = config.tokens.live[EthUtils.addHexPrefix(log.wantToken)];
        const haveToken = config.tokens.live[EthUtils.addHexPrefix(log.haveToken)];


        let trade = {
            'Type'     : 'Trade',
            'Buy'      : giveAmount,
            'Buy_Cur.' : wantToken,
            'Sell'     : takeAmount,
            'Sell_Cur.': haveToken,
            'Fee'      : '',
            'Fee_Cur.' : '',
            'Exchange' : '',
            'Group'    : '',
            'Comment'  : account.name,
            'Date'     : timestamp,
        };

        account.trades.push(trade);
        let newService = this.props.services;
        this.props.addAccount(newService);

    }

    addTrade(account, log){
        let timestamp = new Date(log.args.timestamp * 1000).toLocaleString();

        giveAmount = log.args.giveAmount;
        giveAmount = giveAmount.toString(10);
        giveAmount = web3.fromWei(giveAmount);

        takeAmount = log.args.takeAmount;
        takeAmount = takeAmount.toString(10);
        takeAmount = web3.fromWei(takeAmount);

        let trade = {
            'Type'     : 'Trade',
            'Buy'      : giveAmount,
            'Buy_Cur.' : config.tokens.live[log.args.wantToken],
            'Sell'     : takeAmount,
            'Sell_Cur.': config.tokens.live[log.args.haveToken],
            'Fee'      : '',
            'Fee_Cur.' : '',
            'Exchange' : '',
            'Group'    : '',
            'Comment'  : account.name,
            'Date'     : timestamp,
        };

        account.trades.push(trade);
        let newService = this.props.services;
        this.props.addAccount(newService);

    }

    JSONToCSVConverter(JSONData, ReportTitle, ShowLabel) {

        let header = ["Type","Buy","Cur.","Sell","Cur.","Fee","Cur.", "Exchange","Comment","Date"];

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