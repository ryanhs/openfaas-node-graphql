const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

module.exports = ({ typeDefs, resolvers }) => {
  // make schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // handler
  return async (event, context) => {
    // if need schema || typeDefs
    if (event.body === 'schema' || event.body === 'typeDefs') {
      return context.status(200).succeed(typeDefs);
    }

    // execute:
    // if its string, then treat it like graphql query,
    // if its object, them assume it has { query and variables }
    const gql = typeof event.body === 'string'
      ? ({ query: event.body })
      : ({ query: '', ...event.body });
    const results = await graphql(schema, gql.query, null, null, gql.variables);
    return context.status(200).succeed(results);
  };
};
