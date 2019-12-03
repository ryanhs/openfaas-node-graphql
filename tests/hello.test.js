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

describe('do simple graphql', () => {
  it('say hello using plain string', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler('{ hello(who: "Foo") }');

    await expect(response).resolves.not.toThrow();

    const finalResponse = (await response).data.hello;
    expect(finalResponse).toBe('Hello Foo!');
  });

  it('say hello using graphql object', async () => {
    const handler = handlerWrap(makeHandler(helloSchema));
    const response = handler({
      query: `
        query hello($who: String!) {
          hello(who: $who)
        }
      `,
      variables: {
        who: 'Baz',
      },
    });

    await expect(response).resolves.not.toThrow();

    const finalResponse = (await response).data.hello;
    expect(finalResponse).toBe('Hello Baz!');
  });
});
