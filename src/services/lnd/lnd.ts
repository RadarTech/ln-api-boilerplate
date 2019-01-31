import createLnRpc, { LnRpc, LnRpcClientConfig } from '@radartech/lnrpc';

export class Lightning {
  public static client: LnRpc;

  public static async init(): Promise<void> {
    Lightning.client = await LnRpcClientFactory.createLnRpcClient();
  }
}

/**
 * Creates LN RPC clients
 *
 * @class LnRpcClientFactory
 */
class LnRpcClientFactory {
  public static async createLnRpcClient(): Promise<LnRpc> {
    const config: LnRpcClientConfig = {
      server: process.env.LND_URL,
    };

    if (process.env.LND_MACAROON_PATH) {
      config.macaroonPath = process.env.LND_MACAROON_PATH;
    }

    if (process.env.LND_CERT_PATH) {
      config.tls = process.env.LND_CERT_PATH;
    }

    return createLnRpc(config);
  }
}
