import express from "express"
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
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

app.use('/api/auth', authRoutes)


export default app;