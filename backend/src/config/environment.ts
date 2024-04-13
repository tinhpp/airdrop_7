export const Environment = {
  SERVER_PORT: Number(process.env.SERVER_PORT || 3000),
  SOCKET_PORT: Number(process.env.SOCKET_PORT || 3001),
  SERVER_HOST: process.env.SERVER_HOST || 'http://localhost',

  // Redis Web socket client config
  REDIS_VOTE_HOST: process.env.REDIS_VOTE_HOST || 'localhost',
  REDIS_VOTE_PORT: Number(process.env.REDIS_VOTE_PORT || 6379),
  REDIS_VOTE_PASS: process.env.REDIS_VOTE_PASS,
  REDIS_VOTE_FAMILY: Number(process.env.REDIS_VOTE_FAMILY || 4),
  REDIS_VOTE_DB: Number(process.env.REDIS_VOTE_DB || 0),

  // Redis Order config
  REDIS_ORDER_HOST: process.env.REDIS_ORDER_HOST || 'localhost',
  REDIS_ORDER_PORT: Number(process.env.REDIS_ORDER_PORT || 6379),
  REDIS_ORDER_PASS: process.env.REDIS_ORDER_PASS,
  REDIS_ORDER_FAMILY: Number(process.env.REDIS_ORDER_FAMILY || 4),
  REDIS_ORDER_DB: Number(process.env.REDIS_ORDER_DB || 1),

  // Redis Request config
  REDIS_REQUEST_HOST: process.env.REDIS_REQUEST_HOST || 'localhost',
  REDIS_REQUEST_PORT: Number(process.env.REDIS_REQUEST_PORT || 6379),
  REDIS_REQUEST_PASS: process.env.REDIS_REQUEST_PASS,
  REDIS_REQUEST_FAMILY: Number(process.env.REDIS_REQUEST_FAMILY || 4),
  REDIS_REQUEST_DB: Number(process.env.REDIS_REQUEST_DB || 2),

  // Redis Item config
  REDIS_ITEM_HOST: process.env.REDIS_ITEM_HOST || 'localhost',
  REDIS_ITEM_PORT: Number(process.env.REDIS_ITEM_PORT || 6379),
  REDIS_ITEM_PASS: process.env.REDIS_ITEM_PASS,
  REDIS_ITEM_FAMILY: Number(process.env.REDIS_ITEM_FAMILY || 4),
  REDIS_ITEM_DB: Number(process.env.REDIS_ITEM_DB || 1),

  // OPERATOR ACCOUNT
  OPERATOR_ACCOUNT_PRIVATE_KEY: process.env.OPERATOR_ACCOUNT_PRIVATE_KEY,

  // Web3 host
  NETWORK_RPC_URL:
    process.env.NETWORK_RPC_URL || 'https://rpc-kura.cross.technology/',
  PERMITTED_NFTS_ADDRESS:
    process.env.PERMITTED_NFTS_ADDRESS ||
    '0x6b556f1A587ebEa1b3A42Ba9F6275966CA17BCd5',
  WXCR_ADDRESS:
    process.env.WXCR_ADDRESS || '0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108',
  COLLECTION_ADDRESS:
    process.env.COLLECTION_ADDRESS ||
    '0x25baf69a46923c0db775950b0ef96e6018343a36',
  LENDING_POOL_ADDRESS:
    process.env.LENDING_POOL_ADDRESS ||
    '0x603C668FD2DD8477b755f43C9CCAC6A409684717',
  LOAN_ADDRESS:
    process.env.LOAN_ADDRESS || '0x2Fc03f85aBCE3c3a6D85C71d2589b1E8f7Df06e8',
  CHAIN_ID: process.env.CHAIN_ID || '5555',
  MARKETPLACE_ADDRESS:
    process.env.MARKETPLACE_ADDRESS ||
    '0x3f616c8124c478425dC206fD86568662dc4e50aA',
};
