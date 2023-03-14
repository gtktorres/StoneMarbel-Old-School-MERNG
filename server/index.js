import * as dotenv from 'dotenv' 
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

dotenv.config()
const port = process.env.PORT;
const DB = process.env.ATLAS_URI;

const startServer = async () => {

    const app = express();

    const server = new ApolloServer({
    typeDefs,
    resolvers,
    });
    // Note you must call `server.start()` on the `ApolloServer`
    // instance before passing the instance to `expressMiddleware`
    await server.start();

    // Specify the path where we'd like to mount our server
    app.use('/graphql', cors(), json(), expressMiddleware(server));

    await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Succesfully Connected to Old School Database") })   
    .catch(() => { console.log("Error Connecting to the Mongodb Database") })
    
    app.listen({ port: port }, () =>
        console.log(`🎲🎲 http://localhost:${port}/graphql`)
    );
};

startServer();