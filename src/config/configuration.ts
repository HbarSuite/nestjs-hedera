import { AccountId } from "@hashgraph/sdk";

export default () => ({
  environment: process.env.ENVIRONMENT,
  settings: {
    custom: {
      node: {
        accountId: process.env.LOCAL_NODE_ID,
        privateKey: process.env.LOCAL_NODE_PRIVATE_KEY,
        publicKey: process.env.LOCAL_NODE_PUBLIC_KEY,
      },
      custom: {
        node: {"127.0.0.1:50211": new AccountId(3)},
        mirror: "127.0.0.1:5600"
      },
      mirrorNode: {
        url: "http://localhost:5551"
      }     
    },    
    testnet: {
      node: {
        accountId: process.env.DEV_OPERATOR_ACCOUNT_ID,
        privateKey: process.env.DEV_OPERATOR_PRIVATE_KEY,
        publicKey: process.env.DEV_OPERATOR_PUBLIC_KEY
      },
      custom: {
        node: {"127.0.0.1:50211": new AccountId(3)},
        mirror: "127.0.0.1:5600"
      },      
      mirrorNode: {
        url: "https://testnet.mirrornode.hedera.com"
      }
    },
    mainnet: {
      node: {
        accountId: process.env.PROD_OPERATOR_ACCOUNT_ID,
        privateKey: process.env.PROD_OPERATOR_PRIVATE_KEY,
        publicKey: process.env.PROD_OPERATOR_PUBLIC_KEY,
      },
      custom: {
        node: {"127.0.0.1:50211": new AccountId(3)},
        mirror: "127.0.0.1:5600"
      },
      mirrorNode: {
        url: "https://mainnet-public.mirrornode.hedera.com"
      }
    }
  }
});
