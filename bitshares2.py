from grapheneexchange.exchange import GrapheneExchange
from graphenebase.operations import operations
import sys
import json
import urllib
from pprint import pprint
import time
import bisect

class Config():
    witness_url = "wss://bitshares.openledger.info/ws"
    account     = "nikolai"

client   = GrapheneExchange(Config)
account = Config.account
path = 'bts-dex-trades-2016-raw.json'

cmd = sys.argv[1]
print(cmd)
if cmd == "pull":
    with open(path, 'w') as outfile:
        for entry in client.ws.loop_account_history(
            account,
            only_ops=[operations["fill_order"]]
        ):
            outfile.write(json.dumps(entry)+"\n")

        for entry in client.ws.loop_account_history(
            account,
            only_ops=[operations["asset_issue"]]
        ):
            outfile.write(json.dumps(entry)+"\n")

elif cmd == "show":
    with open(path) as infile:
        for line in infile:
            print(line)

def oldParseFormat():

    for entry in client.ws.loop_account_history(
        account,
        only_ops=[operations["fill_order"]]
    ):
        print(entry)
        block = client.ws.get_block(entry["block_num"])
        order = entry["op"][1]
        recasset = client._get_asset(order["receives"]["asset_id"])
        recamount = int(order["receives"]["amount"]) / 10 ** recasset["precision"]
        payasset = client._get_asset(order["pays"]["asset_id"])
        payamount = int(order["pays"]["amount"]) / 10 ** payasset["precision"]

        aliases = {
            'OPEN.BTC': 'BTC',
            'METAEX.BTC': 'BTC',
            'MKRCOIN': 'MKR',
            'CNY': 'BITCNY',
            'USD': 'BITUSD',
            'OPEN.USD': 'USD'
        }

        recsymbol = recasset["symbol"]
        if recsymbol in aliases.keys():
            recsymbol = aliases[recsymbol]

        paysymbol = payasset["symbol"]
        if paysymbol in aliases.keys():
            paysymbol = aliases[paysymbol]

        priority = [
            'USD',
            'BTC',
            'BTS',
            'BITUSD',
            'BITCNY',
            'MKR',
            'METAFEES',
            'SHAREBIT'
        ]

        payp = priority.index(paysymbol)
        recp = priority.index(recsymbol)
        volume = 0.
        price = 0.
        cost = 0.
        currency = ""
        symbol = ""
        timestamp = block["timestamp"]
        fee = 0
        feecurrency = ""
        if order["fee"]["asset_id"] == "1.3.0":
            fee = order["fee"]["amount"]
            feecurrency = "BTS"

        if payp < recp:
            currency = paysymbol
            symbol = recsymbol
            volume = recamount
            cost = payamount
            price = payamount/recamount
        else:
            currency = recsymbol
            symbol = paysymbol
            volume = payamount
            cost = recamount
            price = recamount/payamount
