export default () => ({
  environment: process.env.ENVIRONMENT,
  settings: {
    development: {
      node: {
        accountId: process.env.DEV_OPERATOR_ACCOUNT_ID,
        privateKey: process.env.DEV_OPERATOR_PRIVATE_KEY,
        publicKey: process.env.DEV_OPERATOR_PUBLIC_KEY
      },
      mirrorNode: {
        url: "https://testnet.mirrornode.hedera.com"
      }
    },
    production: {
      node: {
        accountId: process.env.PROD_OPERATOR_ACCOUNT_ID,
        privateKey: process.env.PROD_OPERATOR_PRIVATE_KEY,
        publicKey: process.env.PROD_OPERATOR_PUBLIC_KEY,
      },
      mirrorNode: {
        url: "https://mainnet-public.mirrornode.hedera.com"
      }
    }
  }
});
