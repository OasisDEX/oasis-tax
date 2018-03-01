define abi
    event ItemUpdate( uint id );
    event Trade( uint sell_how_much, address indexed sell_which_token,
                 uint buy_how_much, address indexed buy_which_token );
endef

export SETH_ABI = $(shell seth abi '$(abi)')

%.address: %.tx.id
	seth receipt `cat $<` contractAddress >$@ || { rm $@; exit 1; }
%.logs: %.address
	seth logs `cat $<` >$@ || { rm $@; exit 1; }
%.events: %.logs
	seth --decode-events <$< >$@ || { rm $@; exit 1; }
%.trades: %.events
	market=`cat $*.address` ./parse-events <$< >$@ || { rm $@; exit 1; }
%.trades.json: %.trades
	{ echo [; sed '$$!s/$$/,/' <$<; echo ]; } >$@ || { rm $@; exit 1; }
%.gz: %
	gzip -k $<
