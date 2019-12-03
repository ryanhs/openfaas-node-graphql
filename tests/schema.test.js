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

describe('response schema', () => {
  it('using "schema"', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler('schema');

    await expect(response).resolves.not.toThrow();
    await expect(response).resolves.toBe(helloSchema.typeDefs);
  });

  it('using "typeDefs"', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler('typeDefs');

    await expect(response).resolves.not.toThrow();
    await expect(response).resolves.toBe(helloSchema.typeDefs);
  });
});
