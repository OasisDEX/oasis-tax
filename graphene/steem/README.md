Sample Config:

server:
      node:        "wss://this.piston.rocks"
      wallet:      "127.0.0.1"
      wallet_port:  8091
      wallet_user: ""
      wallet_pass: ""

ops:
   include: "['transfer_to_vesting', 'transfer', 'withdraw_vesting', 'fill_vesting_withdraw', 'curation_reward', 'author_reward', 'interest', 'fill_order']"
   exclude: "['vote','comment','account_witness_vote','feed_publish','witness_update','pow','account_update','account_witness_proxy','custom_json','limit_order_create']"

