import { Invoice } from '@radartech/lnrpc';
import debug from 'debug';
import * as fs from 'fs';
import winston from 'winston';

const PATHS = {
  LOG: `${process.cwd()}/logs`,
  LOG_ERROR: `${process.cwd()}/logs/_error.log`,
  LOG_INFO: `${process.cwd()}/logs/_info.log`,
};

(() => fs.existsSync(PATHS.LOG) || fs.mkdirSync(PATHS.LOG))();

export const dbg = debug('express:server');

export const logger = winston.createLogger({
  exitOnError: false,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({
      filename: PATHS.LOG_INFO,
      handleExceptions: true,
      level: 'info',
      maxFiles: 2,
      maxsize: 5242880, // 5MB
    }),
    new winston.transports.File({
      filename: PATHS.LOG_ERROR,
      handleExceptions: true,
      level: 'error',
      maxFiles: 2,
      maxsize: 5242880, // 5MB
    }),
    new winston.transports.Console({
      handleExceptions: true,
      level: 'debug',
    }),
  ],
});

/**
 * @param invoice the Invoice Object to log
 */
export function logInvoice(invoice: Invoice) {
  logger.info(`[LND] Invoice log: ${invoice.paymentRequest}.`);
}
