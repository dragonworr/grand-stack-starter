import { neo4jgraphql } from "neo4j-graphql-js";

export const typeDefs = `
type User {
  id: ID!
  name: String
  friends: [User] @relation(name: "FRIENDS", direction: "BOTH")
  reviews: [Review] @relation(name: "WROTE", direction: "OUT")
  avgStars: Float @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN toFloat(avg(r.stars))")
  numReviews: Int @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN COUNT(r)")
}

type Business {
  id: ID!
  name: String
  address: String
  city: String
  state: String
  reviews: [Review] @relation(name: "REVIEWS", direction: "IN")
  categories: [Category] @relation(name: "IN_CATEGORY", direction: "OUT")
}

type Review {
  id: ID!
  stars: Int
  text: String
  business: Business @relation(name: "REVIEWS", direction: "OUT")
  user: User @relation(name: "WROTE", direction: "IN")
}

type Category {
  name: ID!
  businesses: [Business] @relation(name: "IN_CATEGORY", direction: "IN")
}

type Query {
    usersBySubstring(substring: String, first: Int = 10, offset: Int = 0): [User] @cypher(statement: "MATCH (u:User) WHERE u.name CONTAINS $substring RETURN u")
}
`;

export const resolvers = {
  Query: {
    usersBySubstring: neo4jgraphql
  }
};
