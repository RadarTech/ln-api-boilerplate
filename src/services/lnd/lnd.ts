import createLnRpc, {
  GetInfoResponse,
  Invoice,
  LnRpc,
  LnRpcClientConfig,
  PayReq,
  PayReqString,
  SendRequest,
  SendResponse,
  WalletBalanceResponse,
} from '@radartech/lnrpc';

/**
 * Creates and manages LN RPC clients
 *
 * @class LnRpcClientFactory
 */
export class LnRpcClientFactory {
  private static _lnRpcClient: LnRpc;

  public static async getLnRpc(): Promise<LnRpc> {
    if (this._lnRpcClient === undefined) {
      const config: LnRpcClientConfig = {
        server: process.env.LND_URL,
      };

      if (process.env.LND_MACAROON_PATH) {
        config.macaroonPath = process.env.LND_MACAROON_PATH;
      }

      if (process.env.LND_CERT_PATH) {
        config.tls = process.env.LND_CERT_PATH;
      }

      this._lnRpcClient = await createLnRpc(config);
    }
    return this._lnRpcClient;
  }
}

/**
 * Returns result of LND GetInfo RPC call
 */
export async function getInfo(): Promise<GetInfoResponse.AsObject> {
  return (await LnRpcClientFactory.getLnRpc()).getInfo({});
}

/**
 * Returns result of LND WalletBalance RPC call
 */
export async function getWalletBalance(): Promise<
  WalletBalanceResponse.AsObject
> {
  return (await LnRpcClientFactory.getLnRpc()).walletBalance({});
}

/**
 * Returns result of LND DecodePayReq RPC call
 * @param payReq the bolt11 encoded payment request
 */
export async function decodePayReq(payReq: string): Promise<PayReq.AsObject> {
  return (await LnRpcClientFactory.getLnRpc()).decodePayReq(<
    PayReqString.AsObject
  >{
    payReq,
  });
}

/**
 * Returns result of LND SendPaymentSync RPC call
 * @param paymentRequest the bolt11 encoded payment request
 */
export async function sendPayment(
  paymentRequest: string,
): Promise<SendResponse.AsObject> {
  return (await LnRpcClientFactory.getLnRpc()).sendPaymentSync(<
    SendRequest.AsObject
  >{
    paymentRequest,
  });
}

/**
 * Generate a LN invoice using AddInvoice RPC call
 * and return the paymentRequest as bolt11 encoded
 *
 * @param memo optional description to attach to invoice
 * @param valueSatoshis invoice amount in satoshis
 * @param expirySeconds invoice expiration in seconds from now
 */
export async function generateInvoice(
  memo = '',
  valueSatoshis = '1000',
  expirySeconds = '3600',
): Promise<string> {
  const invoice = <Invoice.AsObject>{};
  invoice.memo = memo;
  invoice.value = valueSatoshis;
  invoice.expiry = expirySeconds;
  return (await (await LnRpcClientFactory.getLnRpc()).addInvoice(invoice))
    .paymentRequest;
}
