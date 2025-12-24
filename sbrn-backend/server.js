// 🔑 FIX 1: Ensure dotenv is the first thing that happens.
import dotenv from "dotenv" 
dotenv.config() 

import express from "express"
import cors from "cors"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client' 
import { error } from "console"

const app = express() 
const PORT = 3000

// --- PRISMA CLIENT INITIALIZATION ---
const connectionString = process.env.DATABASE_URL 

// Check if DATABASE_URL is missing. If this fails now, the .env file is definitely invisible 
// to the process, or the file path is incorrect.
if (!connectionString) {
    console.error("==========================================================================")
    console.error("FATAL ERROR: DATABASE_URL is missing after dotenv attempted to load it.")
    console.error("Please ensure your .env file is in the root directory and named exactly '.env'.")
    console.error("==========================================================================")
    process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

app.use(express.json())
app.use(cors())

// --- GET POST BY ID ROUTE ---
app.get(`/get-post/:id`, async (req, res) => {
    
    // Correctly access the 'id' string (req.params.id) 
    const postId = parseInt(req.params.id, 10) 

    // Input validation
    if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID provided. Must be a valid integer." })
    }

    try {
        const fndpost = await prisma.post.findUnique({
            where: { id: postId }, 
            select: {
                content: true,
                title: true,
                author: {
                    select: {
                        id: true,
                        bio: true
                    }
                }
            }
        })

        if (!fndpost) {
            return res.status(404).json({ message: `Post with ID ${postId} not found.` })
        }
        
        return res.json({ post: fndpost })

    } catch(error) {
        console.error("Database error in /get-post/:id:", error.message)
        return res.status(500).json({ error: "Internal server error during database lookup. Check DB stability and credentials." })
    }
})

app.get("/allpost",async(req,res)=>{
    try{
const findallpost =await prisma.post.findMany({
    select:{
        content:true,
        title:true
    }
})
return res.json(findallpost)
    }catch(erro){
        console.log(error.message)
    }
})

app.post("/createuser",async(req,res)=>{
    const{title,content}=req.body
    try{


const crtnewuser=await prisma.user.create({
    data:{
     
    }
})
return res.json(crtnewuser)
    }catch(error){
        console.log(error.message)
    }
})

app.post("/createpost",async(req,res)=>{
    const{title,content,id}=req.body 
    try{
        const createpost=await prisma.post.create({
            data:{
                id:id,
                title:title,
                content:content,
                authorId:1
            }
        })
        return res.json(createpost)
    }catch(error){
        console.log(error.message)
    }
})
// Function to connect to DB and start the server only upon success.
async function startServer() {
    try {
        // 1. Explicitly connect to the database and wait for success.
        await prisma.$connect()
        console.log("Database connection successful.")

        // 2. Start Express server only after DB is ready.
        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`)
        })

    } catch (e) {
        console.error("FATAL ERROR: Could not connect to database on startup.")
        console.error("Please ensure your PostgreSQL database service is running and DATABASE_URL is correct.")
        console.error("Error details:", e.message)
        process.exit(1)
    }
}

// Execute the startup function
startServer()