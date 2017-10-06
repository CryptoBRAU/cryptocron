describe('Engine', () => {
  const exchangeWithPushModelStub = () => {
    let subscribedCallback = () => {};
    return {
      subscribe: (callback) => {
        subscribedCallback = callback;
      },
      pushTransactionFromExchange: (value) => {
        subscribedCallback(value);
      }
    };
  };

  const initializeEngine = (exchange) => {
    let registeredTxScoreCreators = [];
    return {
      register: (txScoreCreator) => {
        registeredTxScoreCreators.push(txScoreCreator);
        return function unregister() {
          for (let i = 0; i < registeredTxScoreCreators.length; i += 1) {
            if (registeredTxScoreCreators[i] === txScoreCreator) {
              registeredTxScoreCreators.splice(i, 1);
              break;
            }
          }
        };
      },
      start: () => {
        exchange.subscribe((transaction) => {
          registeredTxScoreCreators.forEach((txScoreCreator) => {
            txScoreCreator(transaction);
          });
        });
      }
    };
  };

  it('registers an action score to handle a transaction', () => {
    expect.assertions(1);
    const exchange = exchangeWithPushModelStub();
    const engine = initializeEngine(exchange);
    engine.register(function createTxScoreFor(transaction) {
      expect(transaction).toEqual({ buy: 0.0007, sell: 0.0008 });
      return { buy: -1, sell: -1 };
    });
    engine.start();
    exchange.pushTransactionFromExchange({ buy: 0.0007, sell: 0.0008 });
  });

  it('registers many action scores to handle multiple transactions', () => {
    expect.assertions(2);
    const exchange = exchangeWithPushModelStub();
    const engine = initializeEngine(exchange);
    engine.start();

    const unregisterFirstAction = engine.register(function createFirstTxScoreFor(transaction) {
      expect(transaction).toEqual({ buy: 0.0007, sell: 0.0008 });
      return { buy: -1, sell: -1 };
    });
    exchange.pushTransactionFromExchange({ buy: 0.0007, sell: 0.0008 });
    unregisterFirstAction();

    const unregisterSecondAction = engine.register(function createSecondTxScoreFor(transaction) {
      expect(transaction).toEqual({ buy: 0.0001, sell: 0.0002 });
      return { buy: -1, sell: -1 };
    });
    exchange.pushTransactionFromExchange({ buy: 0.0001, sell: 0.0002 });
    unregisterSecondAction();
  });

});
