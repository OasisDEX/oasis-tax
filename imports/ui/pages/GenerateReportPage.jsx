import React, {Component}  from 'react';
import Services from './../lists/services';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import config from './../config.json';
import oasisABI from './../abi_oasis.json';
import etherdeltaABI from './../abi_etherdelta.json';
import { createContainer } from 'meteor/react-meteor-data';
import { HTTP } from 'meteor/http'
import BN from 'bn.js';
import EthUtils from 'ethereumjs-util';
import Web3 from 'web3';

const tradeTypes = {
    DELTA : "etherdelta",
    OASIS : "oasis_event",
    OASIS_LEGACY : "oasis_legacy"
};

export class GenerateReportPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            csv : this.initCSVHeader(),
            oasis: GenerateReportPage.getSimpleMarketContract().at(config.oasis.contract.live.address),
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
                    onClick={this.fetch.bind(this)}
                    className="btn btn-primary btn-download">Generate
                </button>);
        }
    }



    static getSimpleMarketContract(){
        return web3.eth.contract(oasisABI);
    }

    fetch(){

        this.setState({
            isLoading: true,
        });

        let deltaPromises = [];
        let oasisPromises = [];

        let accounts = this.props.services[0].accounts;

        for(let i = 0; i < accounts.length; i++) {

            this.fetchEtherdeltaTradesFromAllContracts(accounts[i],deltaPromises);
      //      oasisPromises.push(this.fetchLegacyTrades(accounts[i]));
              oasisPromises.push(this.fetchAcceptedTrades(accounts[i]));
              oasisPromises.push(this.fetchIssuedTradesFor(accounts[i]));

        }
        Promise.all(oasisPromises).then( () => {
            console.log("oasis stuff checked");
            return Promise.all(deltaPromises);
        }).then( ( data ) => {
            console.log(data);
            return Promise.all(this.fetchAllTimeStampsFromEtherdelta(data));
        }).then( (data) => {

            this.addEtherDeltaTrades(data)
            this.setState({
                isLoading: false,
                hasPayed: true,
            });
        });
    }

    addEtherDeltaTrades(data){
        for(let i=0; i < data.length; i++){

            let giveAmount;
            let takeAmount;
            let haveTokenAddress = data[i].log.args.tokenGive;
            let wantTokenAddress = data[i].log.args.tokenGet;
            let timestamp;
            let wantToken;
            let haveToken;

            giveAmount = web3.fromWei(data[i].log.args.amountGive.toString(10));
            takeAmount = web3.fromWei(data[i].log.args.amountGet.toString(10));

            timestamp = new Date(data[i].timestamp * 1000).toLocaleString();

            const baseCurrency = config.etherdelta.baseCurrency;



            if (wantTokenAddress === baseCurrency) {
                console.log('bid');
                wantToken = config.etherdelta.tokens[haveTokenAddress];
                haveToken = config.etherdelta.tokens[wantTokenAddress];
            } else if (haveTokenAddress === baseCurrency) {
                console.log('ask');
                wantToken = config.etherdelta.tokens[wantTokenAddress];
                haveToken = config.etherdelta.tokens[haveTokenAddress];
            }


            if(typeof wantToken === 'undefined'){
                wantToken = data[i].log.args.tokenGet
            }
            if(typeof haveToken === 'undefined'){
                haveToken = data[i].log.args.tokenGive;
            }



            let trade = {
                'Type'     : 'Trade',
                'Buy'      : giveAmount,
                'Buy_Cur' : wantToken,
                'Sell'     : takeAmount,
                'Sell_Cur': haveToken,
                'Fee'      : '',
                'Fee_Cur' : '',
                'Exchange' : 'Etherdelta.github.io',
                'Group'    : '',
                'Comment'  : data[i].account.name,
                'Date'     : timestamp,
            };

            console.log(trade);

            //add trade to CSV
            this.JSONToCSVConverter(trade);
            data[i].account.trades.push(trade);
        }
        let newService = this.props.services;
        this.props.addAccount(newService);
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
                            this.addTrade(address, data[i], tradeTypes.OASIS_LEGACY);
                        }
                    }

                });
            }
            resolve();
        });
    }

   // address tokenGet, uint amountGet, address tokenGive, uint amountGive, address get, address give

    fetchEtherdeltaTradesFromAllContracts(account, promises){

        const allContracts = config.etherdelta.contract.live;

        for(let i=0;i < allContracts.length;i++) {
            let contract = web3.eth.contract(etherdeltaABI).at(allContracts[i].address);

            promises.push(new Promise((resolve, reject) => {
                contract.Trade({},
                    {
                        fromBlock: config.etherdelta.contract.live[i].block_start,
                        toBlock: config.etherdelta.contract.live[i].block_end
                    }).get((error, logs) => {
                    if (!error) {
                        let trades = [];
                        for(let i = 0; i < logs.length; i++){
                            if(logs[i].args.get === account.name || logs[i].args.give === account.name){
                                let trade =  {
                                    acc: account,
                                    log: logs[i],
                                    };

                                trades.push(trade);
                            }
                        }
                        resolve(trades);
                    } else {
                        reject();
                    }
                });
            }));
        }
    }

    fetchAllTimeStampsFromEtherdelta(data){
        let trades= [];
        let timeStampPromises = [];

        for(let i=0; i < data.length; i++){
        for(let j=0; j < data[i].length; j++ ){
            timeStampPromises.push(
                new Promise( (resolve, reject) => {
                    web3.eth.getBlock(data[i][j].log.blockNumber, function(error, result){
                        if(!error){
                            console.log(result);
                            let trade = {
                                account: data[i][j].acc,
                                log: data[i][j].log,
                                timestamp: result.timestamp
                            };
                            trades.push(trade);
                       //     data[i][j].timeStamp = result.timestamp;
                            resolve(trade);
                        }else{
                            console.error(error);
                            reject();
                        }
                    });
                })
            );
        }
        }

        return timeStampPromises;
    }

    fetchAcceptedTrades(address){
        return new Promise((resolve, reject) => {
            this.state.oasis.LogTake({maker: address.name}, {
                fromBlock: config.oasis.contract.live.blockNumber,
                toBlock: 'latest'}).get( (error, makeLogs) => {
                if(!error){
                    for(let i=0;i < makeLogs.length; i++){
                        this.addTrade(address, makeLogs[i].args, tradeTypes.OASIS);
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
                fromBlock: config.oasis.contract.live.blockNumber,
                toBlock: 'latest'}).get( (error, takeLogs) => {
                if(!error){
                    for(let i = 0; i < takeLogs.length; i++){
                        this.addTrade(address, takeLogs[i].args, tradeTypes.OASIS);
                    }
                    resolve();
                }else {
                    console.debug('Cannot fetch issued trades');
                    reject();
                }
            });
        });
    }

    addTrade(account, log, type){

        let giveAmount;
        let takeAmount;
        let haveTokenAddress;
        let wantTokenAddress;
        let timestamp;
        let wantToken;
        let haveToken;

        switch(type){
            case tradeTypes.OASIS_LEGACY :
                giveAmount = web3.fromWei(new BN(log.giveAmount, 16).toString(10));
                takeAmount = web3.fromWei(new BN(log.takeAmount, 16).toString(10));
                haveTokenAddress = EthUtils.addHexPrefix(log.haveToken);
                wantTokenAddress = EthUtils.addHexPrefix(log.wantToken);
                timestamp = new Date(log.timestamp * 1000).toLocaleString();
                break;
            case tradeTypes.OASIS:
                giveAmount = web3.fromWei(log.giveAmount.toString(10));
                takeAmount = web3.fromWei(log.takeAmount.toString(10));
                haveTokenAddress = log.haveToken;
                wantTokenAddress = log.wantToken;
                timestamp = new Date(log.timestamp * 1000).toLocaleString();
                break;
        }

        const baseCurrency = config.oasis.baseCurrency;


        if (wantTokenAddress === baseCurrency) {
            wantToken = config.oasis.tokens.live[haveTokenAddress];
            haveToken = config.oasis.tokens.live[wantTokenAddress];

        } else if (haveTokenAddress === baseCurrency) {
            wantToken = config.oasis.tokens.live[wantTokenAddress];
            haveToken = config.oasis.tokens.live[haveTokenAddress];
        }

        let trade = {
            'Type'     : 'Trade',
            'Buy'      : giveAmount,
            'Buy_Cur' : wantToken,
            'Sell'     : takeAmount,
            'Sell_Cur': haveToken,
            'Fee'      : '',
            'Fee_Cur' : '',
            'Exchange' : 'Oasisdex.com',
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