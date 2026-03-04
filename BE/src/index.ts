import express, { type Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.use('/api/v1/auth', require('./routes/authRoute.js'));



app.listen(process.env.PORT,()=>{
    console.log('Server running on port '+process.env.PORT)
})