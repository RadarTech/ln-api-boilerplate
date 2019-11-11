import createLnRpc, {
  AutopilotRpc,
  ChainRpc,
  createAutopilotRpc,
  createChainRpc,
  createInvoicesRpc,
  createRouterRpc,
  createSignRpc,
  createWalletRpc,
  createWatchtowerRpc,
  createWtClientRpc,
  InvoicesRpc,
  LnRpc,
  LnRpcClientConfig,
  RouterRpc,
  RpcClientConfig,
  SignRpc,
  WalletRpc,
  WatchtowerRpc,
  WtClientRpc,
} from '@radar/lnrpc';

export class Lightning {
  public static lnrpc: LnRpc;
  public static autopilotrpc: AutopilotRpc;
  public static chainrpc: ChainRpc;
  public static invoicesrpc: InvoicesRpc;
  public static routerrpc: RouterRpc;
  public static signrpc: SignRpc;
  public static walletrpc: WalletRpc;
  public static watchtowerrpc: WatchtowerRpc;
  public static wtclientrpc: WtClientRpc;

  /**
   * Initialize gRPC clients for the main server and all sub-servers
   * @param config The RPC client connection configuration
   */
  public static async init(config?: RpcClientConfig): Promise<void> {
    const rpcConfig = config || this.buildConfig();

    this.lnrpc = await createLnRpc(rpcConfig);
    this.autopilotrpc = await createAutopilotRpc(rpcConfig);
    this.chainrpc = await createChainRpc(rpcConfig);
    this.invoicesrpc = await createInvoicesRpc(rpcConfig);
    this.routerrpc = await createRouterRpc(rpcConfig);
    this.signrpc = await createSignRpc(rpcConfig);
    this.walletrpc = await createWalletRpc(rpcConfig);
    this.watchtowerrpc = await createWatchtowerRpc(rpcConfig);
    this.wtclientrpc = await createWtClientRpc(rpcConfig);
  }

  /**
   * Build the rpc config using environment variable values
   */
  private static buildConfig() {
    const config: LnRpcClientConfig = {
      server: process.env.LND_URL,
    };

    if (process.env.LND_MACAROON_PATH) {
      config.macaroonPath = process.env.LND_MACAROON_PATH;
    }

    if (process.env.LND_CERT_PATH) {
      config.tls = process.env.LND_CERT_PATH;
    }

    if (process.env.LND_MACAROON) {
      config.macaroon = process.env.LND_MACAROON;
    }

    if (process.env.LND_CERT) {
      config.cert = process.env.LND_CERT;
    }

    return config;
  }
}
