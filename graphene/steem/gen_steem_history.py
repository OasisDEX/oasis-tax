#! /usr/bin/python3
from steemapi.steemclient import SteemClient
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
 # Port and host of the RPC-HTTP-Endpoint of the wallet
 wallet_host    = wallet
 wallet_port    = wallet_port
 wallet_user    = wallet_user
 wallet_pass    = wallet_pass
 witness_url    = node

client = SteemClient(Config)

accounts = ['smooth.witness','smooth','pfunk','timsaid','ned']
#account = "riverhead"  # Account to track votes for

startfrom = 2000
limit = 2000


for account in accounts:
  records = []
  print("Working with account: %s" % account)
  file_name = account + "_account_history.json"
  #if os.path.exists( file_name ):
  #  record_file = open( file_name , "r+")
  #  file_stats = os.stat(file_name)
  #  record_file.close()
  
    #if file_stats.st_size > 0:
    #  with open(file_name) as f: 
    #    for line in f:
    #      records.append(json.loads(line))
    #  f.close()
  
  #    last_file_trans = int(float(records[-1][0]))
  #  else:
  #    print("File found but it's empty. Setting last_trans to -1.")
  #    last_file_trans = 0
  #else:
  #  os.system("touch " + file_name )
  last_file_trans = 0
  
  last_trans = last_file_trans
  
  max_trans = int(float(client.rpc.get_account_history(account,-1,0)[0][0]))
  
  new_transactions = max_trans - last_file_trans
  
  if new_transactions > 0:
    print("Found %s new transactions." % new_transactions)
  else:
    continue
  
  if new_transactions < 2001:
    startfrom = last_trans + new_transactions
    limit = new_transactions 
    print("Start at %s and fetch %s" % (startfrom, limit))
  else:
    startfrom = last_trans + 2001
    limit = 2000
    print("Start at %s and fetch %s" % (startfrom, limit))
  
  transactions = client.rpc.get_account_history(account,startfrom,limit)
  
  current_trans = int(float(transactions[0][0]))
  
  
  while last_trans < max_trans:
    for transaction in transactions:
      current_trans = int(float(transaction[0]))
      #print("%s %s" %(last_trans, current_trans))
  
      if current_trans > last_file_trans:
        print("Adding new transaction ID: %s" % current_trans)
        records.append(transaction)
      last_trans = current_trans
  
    if (max_trans - last_trans) < 2001:
      startfrom = startfrom + (max_trans - last_trans)
      limit = (max_trans - last_trans) 
    else:
      startfrom = last_trans + 2000
      limit = 1999
  
    try:
      transactions = client.rpc.get_account_history(account,startfrom,limit)
    except:
      print("Nooope")
      

  with open(file_name, "w") as outfile:
    for record in records:

      timestamp = record[1]['timestamp']
      op        = record[1]['op'][0]

      if op not in ops_exclude:
        if op == "fill_order":
          buy_arr   = record[1]['op'][1]['open_pays'].split()
          sell_arr  = record[1]['op'][1]['current_pays'].split()
          buy       = float(buy_arr[0])
          sell      = float(sell_arr[0])
          buy_cur   = buy_arr[1]
          sell_cur  = sell_arr[1]
          buf       = '[{"Type":"Trade","Buy":%0.3f,"Buy_Cur.":"%s","Sell":%0.3f,"Sell_Cur.":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (buy, buy_cur, sell, sell_cur, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        if op == "fill_vesting_withdraw":
          from_act    = record[1]['op'][1]['from_account']       
          from_arr    = record[1]['op'][1]['withdrawn'].split()
          to_act      = record[1]['op'][1]['to_account']       
          to_arr      = record[1]['op'][1]['deposited'].split()
          from_amount = float(from_arr[0])
          from_cur    = from_arr[1]
          to_amount   = float(to_arr[0])
          to_cur      = to_arr[1]
          buf         = '[{"Type":"Transfer","From_Act.":"%s","From_Amount":%0.6f,"From_Cur":"%s","To_Act.":"%s","To_Amount":%0.6f,"To_Cur.":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (from_act, from_amount, from_cur, to_act, to_amount, to_cur, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        if op == "curation_reward":
          reward_arr    = record[1]['op'][1]['reward'].split()
          reward_amount = float(reward_arr[0])
          reward_cur    = reward_arr[1]
          buf           = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount, reward_cur, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        if op == "author_reward":
          reward_arr         = record[1]['op'][1]['vesting_payout'].split()
          reward_amount_vest = float(reward_arr[0])
          reward_cur_vest    = 'VESTS' 

          reward_arr         = record[1]['op'][1]['steem_payout'].split()
          reward_amount_steem = float(reward_arr[0])
          reward_cur_steem    = 'STEEM'

          reward_arr         = record[1]['op'][1]['sbd_payout'].split()
          reward_amount_sbd = float(reward_arr[0])
          reward_cur_sbd    = 'SBD'
          
          if reward_amount_vest > 0:
            buf = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount_vest, reward_cur_vest, exchange_id, timestamp)
          if reward_amount_steem > 0:
            buf = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount_steem, reward_cur_steem, exchange_id, timestamp)
          if reward_amount_sbd > 0:
            buf = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount_sbd, reward_cur_sbd, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        if op == "interest":
          reward_arr         = record[1]['op'][1]['interest'].split()
          reward_amount_vest = float(reward_arr[0])
          reward_cur_vest    = 'SBD' 
          buf = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount, reward_cur, exchange_id, timestamp)
          outfile.write(buf) 
          continue

        print(op)
        #if op == "pow":
          #print(record)
          #reward_arr         = record[1]['op'][1]['interest'].split()
          #reward_amount_vest = float(reward_arr[0])
          #reward_cur_vest    = 'SBD' 
          #buf = '[{"Type":"Revenue",","Amount":%0.6f,"Rev_Cur":"%s","Fee":"0", "Fee_Cur.":"","Exchange":"exchanges[%i]","Group":"","Comment":"","Date":"%s"}]\n' % (reward_amount, reward_cur, exchange_id, timestamp)
          #outfile.write(buf) 
          #continue
          
  outfile.close()
  
