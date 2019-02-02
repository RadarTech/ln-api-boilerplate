import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

import { app } from '../../../src/index';

describe('ping route', () => {
  it('should return pong', async () => {
    return chai
      .request(app)
      .get('/api/ping')
      .then(res => {
        expect(res.status).to.eql(200);
      });
  });
});
