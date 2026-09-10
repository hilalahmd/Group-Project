import express from "express"
import cors from 'cors'

const app = express();

// middlewares 

app.use(cors());
app.use(express.json());  // to parse json bodies

// health check route (server work akkununundo enn test cheyaann)
app.get('/healthz',(req,res)=>{
    res.status(200).json({
        status:'ok',        
        message:"Server is running",
    })
})


export default app;