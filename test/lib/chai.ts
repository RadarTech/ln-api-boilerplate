import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import { app } from '../../src';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

export const { expect } = chai;
export const rest = {
  client(): ChaiHttp.Agent {
    return chai.request(app).keepOpen();
  },
};
