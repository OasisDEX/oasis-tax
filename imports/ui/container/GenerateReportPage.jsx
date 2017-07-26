import React, {Component}  from 'react';
import Services from '../components/services';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import config from './../config.json';
import oasisABI from './../abi_oasis.json';
import etherdeltaABI from './../abi_etherdelta.json';
import {createContainer} from 'meteor/react-meteor-data';
import {HTTP} from 'meteor/http'
import BN from 'bn.js';
import EthUtils from 'ethereumjs-util';
import Web3 from 'web3';


export default class GenerateReportPage extends Component {

    constructor(props) {
        super(props);

        this.initWeb3();

        console.log(this.props.services);
        this.state = {
            csv: this.initCSVHeader(),
            oasis: GenerateReportPage.getSimpleMarketContract().at(config.oasis.contract.live.address),
            hasPayed: false,
            isLoading: false,

        };
    }

    render() {
        return (
            <div>
                {this.renderReport()}
                {this.renderButtons()}
            </div>
        );

    }

    renderReport() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Generate Report
                </div>
                <Services
                    services={this.props.services}
                    isLoading={this.state.isLoading}
                />
            </div>);
    }

    renderButtons(){
        return (
                <div>
                    {this.generateButton()}
                    <Link to={'/'}>
                        <button type="button" className="btn btn-primary btn-back">Back</button>
                    </Link>
                </div>
        );
    }

    generateButton() {

        let className;
        let buttonName;
        let buttonFunction;

        if (this.state.hasPayed) {
            className = 'btn btn-primary btn-download';
            buttonName = 'Download';
            buttonFunction = this.downloadCSV.bind(this);
        } else {
            className = 'btn btn-primary btn-generate';
            buttonName = 'Generate';
            buttonFunction = this.fetchData.bind(this)
        }
        return (
            <button
                type="button"
                onClick={buttonFunction}
                className={className}>
                    {buttonName}
            </button>);
    }


    static getSimpleMarketContract() {
        return web3.eth.contract(oasisABI);
    }

    fetchData() {
        this.setLoading(true);

        let ethService = this.props.services[0];
        let ethAccounts = ethService.accounts;


        let deltaPromises = [];
        let oasisPromises = [];


        for (let i = 0; i < ethAccounts.length; i++) {

            if(ethService.options[0].active){
                console.log("fetching data from oasis");
                oasisPromises.push(this.fetchAcceptedTrades(ethAccounts[i]));
                oasisPromises.push(this.fetchIssuedTradesFor(ethAccounts[i]));
                oasisPromises.push(this.fetchLegacyTrades(ethAccounts[i]));
            }

            if(ethService.options[1].active){
                console.log("fetching data from etherdelta");
                this.fetchEtherdeltaTradesFromAllContracts(ethAccounts[i], deltaPromises);
            }
        }
        this.fetch(oasisPromises, deltaPromises);

    }


    fetch(oasisPromises, deltaPromises){
        Promise.all(oasisPromises)
            .then(() => {
            return Promise.all(deltaPromises);
          }).then((data) => {
            return Promise.all(this.fetchAllTimeStampsFromEtherdelta(data));
          }).then((data) => {
            this.addEtherDeltaTrades(data);
            this.setLoading(false);
            this.hasPayed(true);
        });
    }

    setLoading(bool) {
        this.setState({
            isLoading: bool,
        });
    }

    hasPayed(bool){
        this.setState({
            hasPayed: bool,
        });
    }


    fetchLegacyTrades(address) {
        return new Promise((resolve, reject) => {
            for (let j = 2; j < 15; j++) {
                HTTP.get(Meteor.absoluteUrl("/maker-otc-" + j + ".trades.json"), (err, result) => {
                    let data = result.data;
                    for (let i = 0; i < data.length; i++) {
                        const taker = EthUtils.addHexPrefix(data[i].taker);
                        const maker = EthUtils.addHexPrefix(data[i].maker);
                        if (taker === address.name || maker === address.name) {
                            this.addOasisLegacyTradeFor(address, data[i])
                        }
                    }

                });
            }
            resolve();
        });
    }

    // address tokenGet, uint amountGet, address tokenGive, uint amountGive, address get, address give

    fetchEtherdeltaTradesFromAllContracts(account, promises) {

        const allContracts = config.etherdelta.contract.live;

        for (let i = 0; i < allContracts.length; i++) {
            let contract = web3.eth.contract(etherdeltaABI).at(allContracts[i].address);

            promises.push(new Promise((resolve, reject) => {
                contract.Trade({},
                    {
                        fromBlock: config.etherdelta.contract.live[i].block_start,
                        toBlock: config.etherdelta.contract.live[i].block_end
                    }).get((error, logs) => {
                    if (!error) {
                        let trades = [];
                        for (let i = 0; i < logs.length; i++) {
                            if (logs[i].args.get === account.name || logs[i].args.give === account.name) {
                                let trade = {
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

    fetchAllTimeStampsFromEtherdelta(data) {

        let timeStampPromises = [];

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                timeStampPromises.push(
                    new Promise((resolve, reject) => {
                        web3.eth.getBlock(data[i][j].log.blockNumber, function (error, result) {
                            if (!error) {
                                console.log(result);
                                let trade = {
                                    account: data[i][j].acc,
                                    log: data[i][j].log,
                                    timestamp: result.timestamp
                                };
                                resolve(trade);
                            } else {
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

    fetchAcceptedTrades(address) {
        return new Promise((resolve, reject) => {
            this.state.oasis.LogTake({maker: address.name}, {
                fromBlock: config.oasis.contract.live.blockNumber,
                toBlock: 'latest'
            }).get((error, makeLogs) => {
                if (!error) {
                    for (let i = 0; i < makeLogs.length; i++) {
                        this.addOasisTradeFor(address, makeLogs[i].args);
                    }
                    resolve();
                } else {
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
                toBlock: 'latest'
            }).get((error, takeLogs) => {
                if (!error) {
                    for (let i = 0; i < takeLogs.length; i++) {
                        this.addOasisTradeFor(address, takeLogs[i].args);
                    }
                    resolve();
                } else {
                    console.debug('Cannot fetch issued trades');
                    reject();
                }
            });
        });
    }

    addOasisTradeFor(account,log){

        let giveAmount = web3.fromWei(log.giveAmount.toString(10));
        let takeAmount = web3.fromWei(log.takeAmount.toString(10));
        let haveTokenAddress = log.haveToken;
        let wantTokenAddress = log.wantToken;
        let wantToken = config.tokens.live[haveTokenAddress];
        let haveToken = config.tokens.live[wantTokenAddress];
        let timestamp = new Date(log.timestamp * 1000).toLocaleString();

        let trade = {
            'Type': 'Trade',
            'Buy': takeAmount,
            'Buy_Cur': wantToken,
            'Sell': giveAmount,
            'Sell_Cur': haveToken,
            'Fee': '',
            'Fee_Cur': '',
            'Exchange': 'Oasisdex.com',
            'Group': '',
            'Comment': account.name,
            'Date': timestamp,
        };

        //add trade to CSV
        this.addTradeToCSV(trade);

        account.trades.push(trade);
        this.updateUI();
    }

    addOasisLegacyTradeFor(account, log) {

        let giveAmount = web3.fromWei(new BN(log.giveAmount, 16).toString(10));
        let takeAmount = web3.fromWei(new BN(log.takeAmount, 16).toString(10));
        let haveTokenAddress = EthUtils.addHexPrefix(log.haveToken);
        let wantTokenAddress = EthUtils.addHexPrefix(log.wantToken);
        let wantToken = config.tokens.live[haveTokenAddress];
        let haveToken = config.tokens.live[wantTokenAddress];
        let timestamp = new Date(log.timestamp * 1000).toLocaleString();

        let trade = {
            'Type': 'Trade',
            'Buy': takeAmount,
            'Buy_Cur': wantToken,
            'Sell': giveAmount,
            'Sell_Cur': haveToken,
            'Fee': '',
            'Fee_Cur': '',
            'Exchange': 'Oasisdex.com',
            'Group': '',
            'Comment': account.name,
            'Date': timestamp,
        };

        //add trade to CSV
        this.addTradeToCSV(trade);

        account.trades.push(trade);
        this.updateUI();

    }

    updateUI(){
        let newService = this.props.services;
        this.props.addAccount(newService);
    }

    addEtherDeltaTrades(data) {

        for (let i = 0; i < data.length; i++) {


            let giveAmount = web3.fromWei(data[i].log.args.amountGive.toString(10));
            let takeAmount = web3.fromWei(data[i].log.args.amountGet.toString(10));
            let haveTokenAddress = data[i].log.args.tokenGive;
            let wantTokenAddress = data[i].log.args.tokenGet;
            timestamp = new Date(data[i].timestamp * 1000).toLocaleString();

            const baseCurrency = config.etherdelta.baseCurrency;

            let wantToken;
            let haveToken;

            if (wantTokenAddress === baseCurrency) {
                console.log('bid');
                wantToken = config.etherdelta.tokens[haveTokenAddress];
                haveToken = config.etherdelta.tokens[wantTokenAddress];
            } else if (haveTokenAddress === baseCurrency) {
                console.log('ask');
                wantToken = config.etherdelta.tokens[wantTokenAddress];
                haveToken = config.etherdelta.tokens[haveTokenAddress];
            }


            if (typeof wantToken === 'undefined') {
                wantToken = data[i].log.args.tokenGet;
            }
            if (typeof haveToken === 'undefined') {
                haveToken = data[i].log.args.tokenGive;
            }


            let trade = {
                'Type': 'Trade',
                'Buy': giveAmount,
                'Buy_Cur': wantToken,
                'Sell': takeAmount,
                'Sell_Cur': haveToken,
                'Fee': '',
                'Fee_Cur': '',
                'Exchange': 'Etherdelta.github.io',
                'Group': '',
                'Comment': data[i].account.name,
                'Date': timestamp,
            };

            console.log(trade);

            //add trade to CSV
            this.addTradeToCSV(trade);
            data[i].account.trades.push(trade);
        }
        let newService = this.props.services;
        this.props.addAccount(newService);
    }

    initWeb3(){
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("new");
        }
    }

    initCSVHeader() {

        let header = config.csv.header;

        let CSV = '';
        let row = '';

        for (let i in header) {
            row += '"' + header[i] + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';

        return CSV;
    }

    addTradeToCSV(trade) {

        let csvEdited = this.state.csv;
        let row = '';

        let tradeData;

        if(typeof trade !== 'object'){
            tradeData = JSON.parse(trade);
        }else {
            tradeData = trade;
        }

        for (let i in tradeData) {
            row += '"' + tradeData[i] + '",';
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

        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.state.csv);

        const link = document.createElement("a");
        link.href = uri;

        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

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