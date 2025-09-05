import express,{Request, Response} from "express";
import {json } from "body-parser";


const app = express();
app.use(json());

const PORT = process.env.PORT || 6000;

app.get('/',(req:Request , res:Response)=>{
    console.log("test");
    res.send("yes it works");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})