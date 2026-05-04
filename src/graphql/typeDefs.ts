import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date
  scalar JSON

  enum ContractGrade {
    A
    B
    C
  }

  type Contract {
    id: ID!
    grade: ContractGrade!
    baseSalary: Float!
    matchFee: Float!
    renewalDate: Date!
  }

  type MatchLog {
    id: ID!
    matchId: String!
    ballNumber: Int!
    overNumber: Int!
    batsmanId: String!
    bowlerId: String!
    runs: Int!
    isWicket: Boolean!
    extras: Int!
    metadata: JSON
    createdAt: Date!
  }

  type PlayerProfile {
    id: ID!
    name: String!
    dateOfBirth: Date!
    nationality: String!
    role: String!
    contract: Contract
    recentMatches: [MatchLog!]!
  }

  type Query {
    getPlayerProfile(id: ID!): PlayerProfile
  }
`;
