import { expect, rest } from '../../lib';

describe('ping route', () => {
  const client = rest.client();

  it('should return pong', async () => {
    const { status } = await client.get('/api/ping');
    expect(status).to.equal(200);
  });
});
