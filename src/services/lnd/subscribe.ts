import { Invoice } from '@radar/lnrpc';
import { Lightning } from '.';
import { logger } from '..';

/**
 * @param invoice the Invoice Object to log
 */
export function logInvoice(invoice: Invoice) {
  logger.info(`[LND] Invoice log: ${invoice.paymentRequest}.`);
}

/**
 * Create subscribers to LND events with callback support
 *
 * @class LnRpcSubscriptionManager
 */
export class LnRpcSubscriptionManager {
  private static _invoiceSubscriber: any;

  public static async subscribeInvoices(
    eventCallback: (invoice: Invoice) => void = logInvoice,
  ): Promise<void> {
    if (this._invoiceSubscriber === undefined) {
      this._invoiceSubscriber = Lightning.lnrpc.subscribeInvoices();
    }

    this._invoiceSubscriber.on('data', (invoice: Invoice) => {
      eventCallback(invoice);
    });
  }
}
