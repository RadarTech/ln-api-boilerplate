import dotenv from 'dotenv';
import { Server } from './app';
import { isTestEnv } from './env';
import { logger } from './services';
import { Lightning, LnRpcSubscriptionManager } from './services/lnd';

dotenv.config();

export const app = Server.bootstrap().app;

if (!isTestEnv()) {
  (async () => {
    await Lightning.init();
    logger.info(
      `[LND] Pubkey: ${(await Lightning.lnrpc.getInfo()).identityPubkey}.`,
    );
    logger.info(
      `[LND] Confirmed Wallet Balance (sats): ${
        (await Lightning.lnrpc.walletBalance()).confirmedBalance
      }.`,
    );
    await LnRpcSubscriptionManager.subscribeInvoices();

    const port = process.env.SERVER_PORT;
    app.listen(port);
    logger.info(`[App] Server listening on port: ${port}.`);
  })();
}
