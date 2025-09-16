import express,{Request, Response} from "express";
import {json } from "body-parser";
import http from 'http';
import { Server } from "socket.io";
import authRouter from "./routes/authRoutes";
import conversationRouter from "./routes/conversationRoutes";
import messageRouter from "./routes/messageRoutes";
import { strictEqual } from "assert";
import { saveMessage } from "./controllers/messageControllers";


const app = express();
const server  = http.createServer(app);
app.use(json());
const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

app.use('/api/auth',authRouter);
app.use('/api/conversations',conversationRouter);
app.use('/api/messages',messageRouter);

io.on('connection',(socket)=>{
    console.log('A user connected:',socket.id);

    socket.on('joinConversation',(conversationId)=>{
        socket.join(conversationId);
        console.log('User joined conversation :'+conversationId);
    });

    socket.on('sendMessage',async (message)=>{
        const { conversationId, senderId, contents} = message;

        try{
            const savedMessage = await saveMessage(conversationId,senderId,contents);
            console.log("send Message :");
            console.log(savedMessage);

            io.to(conversationId).emit('newMessage',saveMessage);

        }catch(error){
            console.error('Failed to save message:',error);
        }

        socket.on('disconnect',()=>{
            console.log('User disconnected',socket.id);
        })
    })
})

const PORT = process.env.PORT || 6000;

app.get('/',(req:Request , res:Response)=>{
    console.log("test");
    res.send("yes it works");
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})