import "dotenv/config"; // Shorthand to load env immediately
import pkg from 'pg';
const { Pool } = pkg; // Destructure Pool from the package
import express from "express";
import cors from "cors"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import Uservar from "./user.js";

const app = express();

// 1. Verify the connection string exists
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ Error: DATABASE_URL is not defined in .env");
    process.exit(1);
}

// 2. Initialize the Pool and Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());



//create post 
app.post("/create-post",requireAuth(),async(req,res)=>{


    const{title,content}=req.body 

   try{
const user=await Uservar(req.auth.userId)
if(!user){
    console.log("user not found")
}
const createpost=await prisma.post.create({
    data:{
        title:title,
        content:content,
        authorId:user.id
    }
})
return res.json(createpost)
   }catch(error){
    
console.log(error.message)
   }
})


//get posts 

app.get("/get-post",requireAuth(),async(req,res)=>{
    try{
const usr=await Uservar(req.auth.userId)
if(!usr){
    console.log("usuer not found to get all the post")
}
const getpost=await prisma.post.findMany({
    where:{
        authorId:usr.id,
    },
    select:{
        id:true,
        title:true,
        content:true,
        comments:true
    }
})

return res.json(getpost)
    }catch(error){
        console.log(error.message)
    }
})

//delete post 
app.delete("/delete-post",requireAuth(),async(req,res)=>{
    const postid=req.body.id 
    const clrk=req.auth.userId
    try{
        const user=await Uservar(req.auth.userId)
        if(!user){
            console.log("user not found")
        }
        const deletepost=await prisma.post.deleteMany({
where:{id:postid,
    authorId:clrk
}
        })
        return res.json(deletepost)
    }catch(error){
        console.log(error.message)
    }
})

app.listen(3000,()=>{
    console.log('emu is listening')
})

