const poloniexExchange = (pair) => {
  return {
    onTick: (handlePoloniexTick) => {
      // Simulates poloniex tick
      // Poll the Poloniex API to get all the transaction values for the given pair.
      // If the polling happened after some transactions went through, run the
      // handlePoloniexTick() function for every transaction that comes from Poloniex.
      // All exchange objects should conform to this interface
      setInterval(() => {
        const transaction = {
          value: 0.0007
        };
        handlePoloniexTick(transaction);
      });
    };
  };
};

const createEngineFor = (exchange) => {
  const registeredActionsToScore = [];
  return {
    register: (scoreActionForTick) => {
      registeredActionsToScore.push(scoreActionForTick);
    };
    start: () => {
      const handlePoloniexTick = (transaction) => {
          const transactionScores = registeredActionsToScore.map((executeActionFor) => {
            return executeActionFor(transaction);
          });
          // The transactionScore will represent a list of scores
          // Their usage will be to define the likelihood of buying or selling a
          // given pair
          // transactionScore.buy
          // transactionScore.sell
        });
      };
      // Simulates Poloniex tick
      exchange.onTick(handlePoloniexTick);
    };
  }
};

// Example of usage for the engine

const BTC_USDT_poloniexTradingEngine = createEngineFor(poloniexExchange('BTC_USDT'));
const BTC_ETH_poloniexTradingEngine = createEngineFor(poloniexExchange('BTC_ETH'));

BTC_USDT_poloniexTradingEngine.register((transaction) => {
  if (transaction.value > 0.00005) {
    return {
      buy: 80, // score
      sell: 20 // score
    };
  }
});

BTC_USDT_poloniexTradingEngine.register((transaction) => {
  if (transaction.value > 0.1) {
    return {
      buy: 5, // score
      sell: 70 // score
    };
  }
});
