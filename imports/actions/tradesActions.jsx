import {HTTP} from 'meteor/http'
import unit from 'ethjs-unit';
import EthUtils from 'ethereumjs-util';
import BN from 'bn.js';
import config from '../config.json';
import {addTrade} from '../actions/providersActions'

export function getLegacyTrades(address) {
    return (dispatch) => {
            let trades = [];
            for (let j = 2; j < 15; j++) {
                HTTP.get(Meteor.absoluteUrl("/maker-otc-" + j + ".trades.json"), (err, result) => {
                    let data = result.data;
                    for (let i = 0; i < data.length; i++) {
                        const taker = EthUtils.addHexPrefix(data[i].taker);
                        const maker = EthUtils.addHexPrefix(data[i].maker);
                        if (taker === address.name || maker === address.name) {
                            dispatch(addOasisTrade(address,data[i]))
                        }
                    }
                    return trades;
                });
            }
    };
}

function addOasisTrade(address, trade){
    return (dispatch) => {
        let buy_currency;
        let buy_amount;

        let sell_currency;
        let sell_amount;

        let haveTokenFromOffer;
        let wantTokenFromOffer;

        let haveAmount;
        let wantAmount;

        haveTokenFromOffer = config.tokens.live[EthUtils.addHexPrefix(trade.haveToken)];
        wantTokenFromOffer = config.tokens.live[EthUtils.addHexPrefix(trade.wantToken)];

        //if legacy
        if(!(BN.isBN(trade.giveAmount))){

            haveAmount = unit.fromWei(new BN(trade.giveAmount, 16).toString(10), 'ether');
            wantAmount = unit.fromWei(new BN(trade.takeAmount, 16).toString(10), 'ether');
        }else {
            haveAmount = unit.fromWei(trade.giveAmount.toString(10));
            wantAmount = unit.fromWei(trade.takeAmount.toString(10));
        }

        const taker = EthUtils.addHexPrefix(trade.taker);


        if (taker === address.name.toLowerCase()){
            buy_amount = wantAmount;
            buy_currency = haveTokenFromOffer;

            sell_amount = haveAmount;
            sell_currency = wantTokenFromOffer;
        }else {

            buy_amount = wantAmount;
            buy_currency = wantTokenFromOffer;

            sell_amount = haveAmount;
            sell_currency = haveTokenFromOffer;
        }

        let csvTrade = {
            'Type': 'Trade',
            'Buy': buy_amount,                  //wantAmount
            'Buy_Cur': buy_currency,            //wantToken
            'Sell': sell_amount,                //haveAmount
            'Sell_Cur': sell_currency,          //haveToken
            'Fee': '',
            'Fee_Cur': '',
            'Exchange': 'Oasisdex.com',
            'Group': '',
            'Comment': address.name,
            'Date': new Date(trade.timestamp * 1000).toLocaleString(),
        };

        let newTrade= {
            trade: csvTrade,
            provider: "ethereum",
            accountName: address.name
        };
        dispatch(addTrade(newTrade));

    }
}