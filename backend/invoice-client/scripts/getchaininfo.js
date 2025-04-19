const { ApiPromise, WsProvider } = require('@polkadot/api');

async function getChainInfo(endpoint) {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  await api.disconnect();
  return { chain: chain.toHuman(), nodeName: nodeName.toHuman(), nodeVersion: nodeVersion.toHuman() };
}

module.exports = { getChainInfo };