const chai = require('chai');
const expect = chai.expect;

it('Initializes the trading engine', () => {
  const exchange = () => {};
  const initializeEngine = () => {
    return {
      register: (callback) => {
        callback({ buy: 0.0007, sell: 0.0008 });
      },
      start: () => {}
    };
  };

  const engine = initializeEngine(exchange('BTC_USDT'));
  engine.register(function createActionScoreFor(transaction) {
    expect(transaction).to.eql({
      buy: 0.0007,
      sell: 0.0008
    });
    return {
      buy: -1,
      sell: -1
    };
  });
  engine.start();
});
