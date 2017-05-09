#! /usr/bin/python3
from bitshares import BitShares
from bitshares.account import Account
from bitshares.asset import Asset
from bitshares.blockchain import Blockchain
from bitsharesbase.objects import Operation, AssetOptions
from bitsharesbase import transactions, operations
import datetime
import time
import os
import json
import sys
import yaml

with open("config.yml", "r") as config_file:
 config = yaml.load(config_file)
 node        = config['server']['node']
 wallet      = config['server']['wallet']
 wallet_port = config['server']['wallet_port']
 wallet_user = config['server']['wallet_user']
 wallet_pass = config['server']['wallet_pass']

 ops_include = config['ops']['include']
 ops_exclude = config['ops']['exclude']

 exchange_id = config['exchange']['id']

class Config():
 #Port and host of the RPC-HTTP-Endpoint of the wallet
 wallet_host    = wallet
 wallet_port    = wallet_port
 wallet_user    = wallet_user
 wallet_pass    = wallet_pass
 witness_url    = node

accounts = ['nikolai']
bitshares = BitShares()
blockchain = Blockchain()

def get_time_of_block(block_num):
  return(blockchain.block_time(block_num))

def lookup_asset(asset_id):
  #print(asset(asset_id))
  if asset_id == "1.3.0":
    return("BTS")
  if asset_id == "1.3.757":
    return("OPEN.USD")
  if asset_id == "1.3.121":
    return("BIT.USD")
  if asset_id == "1.3.113":
    return("BIT.CNY")
  if asset_id == "1.3.861":
    return("OPEN.BTC")
  if asset_id == "1.3.933":
    return("MKR")
  if asset_id == "1.3.472":
    return("METAFEES")
  if asset_id == "1.3.592":
    return("METAEX.BTC")
  if asset_id == "1.3.839":
    return("SHAREBIT")
  if asset_id == "1.3.539":
    return("MKRCOIN")



for acc in accounts:
  account = Account(acc, full=True)
  records = []
  print("Working with account: %s" % acc)
  file_name = acc + "_bitshares_account_history.json"

  transactions = account.history(first=0, limit=10000000)
  count = 0 
  with open(file_name, "w") as outfile:
    seen = []
    for record in transactions:
      count = count + 1  
      timestamp = get_time_of_block(record['block_num'])
      op        = record['op']

      #0	Transfer 	btsabc.org sent 10 IOU.XFQ to nikolai
      #1	Order		wants 150 CNY for 5,540 BTS
      #2	Cancel		nikolai cancel order 
      #3	Adj. Short	nikolai adjust collateral by 42,649 BTS, debt by 0 USD
      #4	Fill		nikolai paid 1.36 OPEN.USD for 1.412 USD 
      #6	Update Slate	nikolai update account/votes
      #14	Issue Asset	btcto100k issue 20 FAISAL to nikolai
      #17	Settle		nikolai settle 150 CNY
      #37	Claim Vesting	nikolai claimed 1,022 BTS 
      
      
      #if op[0] not in seen:
      #  seen.append(op[0])
      #  print ("%i %i" % (timestamp, op[0]))
 
      #continue
      
      op_code = int(op[0])
      op = op[1]
      #op_name = Operation.getOperationNameForId("",op_code)      
      #print(op_code, op_name)

      if op_code not in [1,2,6]:

        if op_code == 0: #Transfer

           #{'fee': {'amount': 3273437, 'asset_id': '1.3.0'}, 'memo': {'nonce': '2091125734925389153', 'from': 'BTS5UJBnRKcaysHN8iXCDUr5zkjN8U393EVbK5PfjgU8P3sjSYmXv', 'to': 'BTS64FK8SjRMgXCo47xorLTJ8G5A3pvqnRFGXTEKYQjPj3R2ThM67', 
           #'from': '1.2.97259', 'amount': {'amount': 31631, 'asset_id': '1.3.839'}, 'extensions': [], 'to': '1.2.228'}

           fee_amount  = float(op['fee']['amount'])
           fee_cur     = lookup_asset(op['fee']['asset_id'])
	
           from_acct   = op['from']
           to          = op['to']
           amount      = float(op['amount']['amount'])
           amount_cur  = lookup_asset(op['amount']['asset_id'])
           buf       = '[{"Type":"Transfer", "From":"%s", "To":"%s","amount":"%f","amount_cur":"%s","Fee":"%f","Fee_Cur.":"%s","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (from_acct, to, amount, amount_cur, fee_amount, fee_cur, exchange_id, timestamp)
           outfile.write(buf)
           continue


        if op_code == 4: #Trade
           #[4, {'account_id': '1.2.228', 'pays': {'amount': 504000, 'asset_id': '1.3.539'}, 
           #                              'receives': {'amount': 403200000, 'asset_id': '1.3.0'}, 'order_id': '1.7.72543', 'fee': {'amount': 0, 'asset_id': '1.3.0'}}]
           #print (record)
           buy       = int(op['receives']['amount'])
           sell      = int(op['pays']['amount'])
           buy_cur   = lookup_asset(op['receives']['asset_id'])
           sell_cur  = lookup_asset( op['pays']['asset_id'])
           buf       = '[{"Type":"Trade","Buy":%0.3f,"Buy_Cur.":"%s","Sell":%0.3f,"Sell_Cur.":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (buy, buy_cur, sell, sell_cur, exchange_id, timestamp)
           outfile.write(buf) 
           continue

        if op_code == 37: #Divest
           #[37, {'deposit_to_account': '1.2.228', 'fee': {'amount': 0, 'asset_id': '1.3.0'}, 'total_claimed': {'amount': 102242168, 'asset_id': '1.3.0'}, 
           #                                       'balance_to_claim': '1.15.69094', 'balance_owner_key': 'BTS8bQ8zznmFi9NRuS4d7xWpG4RnDFvPHhGKpmReC47mGpnzrmJY6'}]
          from_act    = acc
          to_act      = acc
          amount      = float(op['total_claimed']['amount'])
          from_cur    = 'BTS'
          fee_amount  = float(op['fee']['amount'])
          fee_cur     = lookup_asset(op['fee']['asset_id'])

          buf         = '[{"Type":"Divest","From_Act.":"%s","From_Amount":%0.6f,"From_Cur":"%s","To_Act.":"%s","To_Amount":%0.6f,"To_Cur.":"%s","Fee":"%f", "Fee_Cur.":"%s","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (from_act, amount, from_cur, from_act, amount, from_cur, fee_amount, fee_cur, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        if op_code == 3: #Adjust Short
           #[37, {'deposit_to_account': '1.2.228', 'fee': {'amount': 0, 'asset_id': '1.3.0'}, 'total_claimed': {'amount': 102242168, 'asset_id': '1.3.0'}, 
           #                                       'balance_to_claim': '1.15.69094', 'balance_owner_key': 'BTS8bQ8zznmFi9NRuS4d7xWpG4RnDFvPHhGKpmReC47mGpnzrmJY6'}]
          from_act    = acc
          to_act      = acc
          amount      = float(op['total_claimed']['amount'])
          from_cur    = 'BTS'
          fee_amount  = float(op['fee']['amount'])
          fee_cur     = lookup_asset(op['fee']['asset_id'])

          buf         = '[{"Type":"Short","From_Act.":"%s","From_Amount":%0.6f,"From_Cur":"%s","To_Act.":"%s","To_Amount":%0.6f,"To_Cur.":"%s","Fee":"%f", "Fee_Cur.":"%s","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (from_act, amount, from_cur, from_act, amount, from_cur, fee_amount, fee_cur, exchange_id, timestamp)
          outfile.write(buf)
          continue


  print("Processed %i records" % count)
  outfile.close()
  
