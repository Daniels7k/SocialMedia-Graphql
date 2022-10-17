const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose.connect(MONGODB).then(() => {
  console.log("MongoDB Connected");
  server.listen({ port: 5000 }).then((res) => {
    console.log(`Server running at ${res.url}`);
  });
});
