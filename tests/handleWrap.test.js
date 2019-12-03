const handlerWrap = require('./../lib/handlerWrap');
const makeHandler = require('./../lib/index');

const helloSchema = {
  typeDefs: `
    type Query {
        hello(who: String!): String!
    }
    schema {
      query: Query
    }
  `,
  resolvers: {
    Query: {
      hello: (_, { who = 'world' }) => `Hello ${who}!`,
    },
  },
};


describe('wrap handler', () => {
  it('should success', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler('{ hello(who: "Foo") }');
    await expect(response).resolves.not.toThrow();
  });

  it('should fail', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler('{ hello(invalid: "Foo") }');
    await expect(response).rejects.toThrow();
  });
});
