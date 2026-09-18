import express from "express"
import cors from 'cors'
import { toNodeHandler } from "better-auth/node";
import { auth } from "./modules/auth/auth.config.js";
import morgan from 'morgan';


// Handle BigInt serialization in JSON response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

// middlewares 

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

app.use(express.json());  // to parse json bodies

// health check route (server work akkununundo enn test cheyaann)
app.get('/healthz',(req,res)=>{
    res.status(200).json({
        status:'ok',        
        message:"Server is running",
    })
})

app.use("/api/auth", toNodeHandler(auth));






export default app;