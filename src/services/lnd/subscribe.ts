import { Invoice, InvoiceSubscription } from '@radartech/lnrpc';
import { Lightning } from '.';
import { logInvoice } from '../logger';

/**
 * Create subscribers to LND events with callback support
 * TODO add transaction event subscriber
 * TODO add channelgraph event subscriber
 *
 * @class LnRpcSubscriptionManager
 */
export class LnRpcSubscriptionManager {
  private static _invoiceSubscriber: any;

  public static async subscribeInvoices(
    eventCallback: (invoice: Invoice.AsObject) => void = logInvoice,
  ): Promise<void> {
    if (this._invoiceSubscriber === undefined) {
      this._invoiceSubscriber = await Lightning.client.subscribeInvoices(<
        InvoiceSubscription.AsObject
      >{});
    }

    this._invoiceSubscriber.on('data', (invoice: Invoice.AsObject) => {
      eventCallback(invoice);
    });
  }
}
