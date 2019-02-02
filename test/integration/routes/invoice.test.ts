// import { app } from '../../../src/index';

// describe('invoice route', () => {
//   it.skip('should GET invoice', done => {
//     supertest(app)
//       .get('/api/invoice')
//       .end((err: any, res: supertest.Response) => {
//         if (err) {
//           done(err);
//         } else {
//           expect(res.status).toBe(200);
//           expect(res.body.invoice).toBeDefined;
//           done();
//         }
//       });
//   });

//   it.skip('should POST invoice/pay to pay route and return preimage', done => {
//     supertest(app)
//       .post('/api/invoice/pay')
//       .send({
//         invoice: 'invoice',
//       })
//       .end((err: any, res: supertest.Response) => {
//         if (err) {
//           done(err);
//         } else {
//           expect(res.status).toBe(200);
//           expect(res.body.preimage).toBe('preimage');
//           done();
//         }
//       });
//   });

//   it.skip('should return error on POST invoice/pay with >10000 sats', done => {
//     supertest(app)
//       .post('/api/invoice/pay')
//       .send({
//         invoice: 'invoice',
//       })
//       .end((err: any, res: supertest.Response) => {
//         if (err) {
//           done(err);
//         } else {
//           expect(res.status).toBe(400);
//           expect(res.body.error[0].msg).toMatch(
//             /^Payment Request amount exceeds 10000 satoshi.*$/,
//           );
//           done();
//         }
//       });
//   });

//   it.skip('should return paymentError on POST invoice/pay if LND SendPayment fails', done => {
//     const expectedPaymentError = 'invoice expired';
//     supertest(app)
//       .post('/api/invoice/pay')
//       .send({
//         invoice: 'invoice',
//       })
//       .end((err: any, res: supertest.Response) => {
//         if (err) {
//           done(err);
//         } else {
//           expect(res.status).toBe(400);
//           expect(res.body.error).toMatch(expectedPaymentError);
//           done();
//         }
//       });
//   });
// });
