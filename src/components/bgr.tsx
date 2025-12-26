import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

interface rn{
    content:string 
    title:string 
}

function Bgr(){
    const queryclient=useQueryClient()
    const [title,setTitle]=useState("")
    const [content,setContent]=useState("")
    const[id,setId]=useState(0)
    const fetchdata=async():Promise<rn[]>=>{
        const response=await axios.get("http://localhost:3000/allpost")
        return response.data
    }
    const{isLoading,isError,data,refetch}=useQuery({
        queryKey:["baground"],
        queryFn:fetchdata,
        staleTime:1000*60*5
    })

    const handlecreate=async()=>{
        await axios.post("http://localhost:3000/createuser")
    }


    const createpost=async(data:{title:string,content:string,id:number})=>{
        await axios.post("http://localhost:3000/createpost",{
            title:data.title,
            content:data.content,
            id:data.id
        })
    }

    const{mutate}=useMutation({
        mutationFn:createpost,

    onMutate:async(newpost)=>{
        await queryclient.cancelQueries({queryKey:["baground"]})

        const previouspost=queryclient.getQueryData(["baground"])

        queryclient.setQueryData(["baground"],(olddata:[])=>{
            return[...(olddata || []),newpost ]
        })
        return {previouspost}
    },
    onSettled: () => {
    queryclient.invalidateQueries({ queryKey: ["baground"] });
  },
  onError:(error,newpost,context)=>{
    queryclient.setQueryData(["baground"],context?.previouspost)
  }
});

    
    const handlecreatepost=()=>{
        mutate({ title,content,id})
    }
    if(isLoading){
        return <div className="loading-spinner">Loading...</div>

    }
  
    if(isError){
        return <h2 className="text-red-500">Error encountred</h2>
    }
   
    return(
        <div className="flex flex-col justify-center items-center gap-5">
            <button className="btn bnt-secondary" onClick={()=>refetch()}>Refresh</button>
            <button className="btn btn-accent" onClick={()=>handlecreate()}>Create user</button>
            < div className="border border-base-200 shadow-xl bg-base-500 flex flex-col gap-2">
            <input type="text" placeholder="Title" className="border-0 rounded-lg" value={title}onChange={(e)=>setTitle(e.target.value)}/>
                       <input type="text" placeholder="content" className="border-0 rounded-lg" value={content}onChange={(e)=>setContent(e.target.value)}/>
                       <input type="number" placeholder="number-id" className="border-0 rounded-lg" value={id}onChange={(e)=>setId(Number(e.target.value))}/>
 <button className="btn btn-accent bnt-outline" onClick={()=>handlecreatepost()}>Create post</button>
            </div>
            {data?.map((ele)=>(
                <div key={ele.title} className="flex justify-center items-center flex-col">
<h2 className="flex font-bold flex-col">{ele.title}</h2>
<h2 className="flex font-semibold flex-col  text-teal-300">{ele.content}</h2>
                    </div>
            ))}
        </div>
    )
}

export default Bgr