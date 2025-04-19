const { expect } = require('chai');
const { getChainInfo } = require('../scripts/getchaininfo');

describe('Polkadot.js Chain Info', function () {
  this.timeout(10000); // increase timeout for async ws connection

  it('should return chain info', async () => {
    const info = await getChainInfo('wss://westend-rpc.polkadot.io');
    expect(info).to.have.property('chain');
    expect(info).to.have.property('nodeName');
    expect(info).to.have.property('nodeVersion');
    console.log(info);
  });
});