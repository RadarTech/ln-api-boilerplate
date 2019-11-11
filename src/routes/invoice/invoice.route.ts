import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { logger } from '../../services';
import { Lightning } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /invoice Invoice Request
 * @api {post} /invoice/pay Pay Invoice Request
 * @apiName Invoice
 * @apiGroup Invoice
 *
 * @apiSuccess 200
 */
export class InvoiceRoute extends BaseRoute {
  public static path = '/invoice';
  private static instance: InvoiceRoute;

  /**
   * @class InvoiceRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.pay = this.pay.bind(this);
    this.init();
  }

  static get router() {
    if (!InvoiceRoute.instance) {
      InvoiceRoute.instance = new InvoiceRoute();
    }
    return InvoiceRoute.instance.router;
  }

  private init() {
    logger.info('[InvoiceRoute] Creating invoice route.');
    this.router.get('/', this.get);
    this.router.post(
      '/pay',
      [
        check('invoice').exists(),
        body('invoice').custom(async encodedPayReq => {
          const { numSatoshis } = await Lightning.lnrpc.decodePayReq({
            payReq: encodedPayReq,
          });
          // add custom payment conditions...ie. max invoice amount
          if (new BigNumber(numSatoshis).gt(10000)) {
            throw new Error(
              `Payment Request amount exceeds 10000 satoshi (${numSatoshis})`,
            );
          }
        }),
      ],
      this.pay,
    );
  }

  /**
   * Get a newly generated invoice for 1000 sats
   * @class InvoiceRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentRequest } = await Lightning.lnrpc.addInvoice({
        value: '1000',
      });
      logger.info(`[InvoiceRoute] Invoice created: ${paymentRequest}.`);
      res.json({ invoice: paymentRequest });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  /**
   * Accept an invoice for payment
   * @class InvoiceRoute
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async pay(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
        `[InvoiceRoute] /pay validation error: ${JSON.stringify(
          errors.array(),
        )}.`,
      );
      res.status(400).json({ error: errors.array() });
      return;
    }

    try {
      const {
        paymentPreimage,
        paymentError,
      } = await Lightning.lnrpc.sendPaymentSync({
        paymentRequest: req.body.invoice,
      });
      if (paymentError) {
        throw new Error(paymentError);
      }

      const preimage = (paymentPreimage as Buffer).toString('hex');
      logger.info(
        `[InvoiceRoute] /pay payment complete for preimage: ${preimage}.`,
      );
      res.status(200).json({
        preimage,
      });
    } catch (err) {
      logger.info(`[InvoiceRoute] /pay error: ${err}.`);
      res.status(400).json({ error: err.message });
    }
  }
}
