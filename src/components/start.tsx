import {  useQuery } from "@tanstack/react-query"
import axios from "axios"


interface rn{
    content:string 
    title:string 
    id:number
    author: {
    id: number;
    bio: string;
  };
}

interface apires{
    post:rn
}
interface gtall{
    content:string 
    title:string
}



function Sr(){
   const id=1
const gt=async():Promise<apires>=>{
const fetchdata=await axios.get(`http://localhost:3000/get-post/${id}`)
    return fetchdata.data
}

const gtall=async():Promise<gtall[]>=>{
    const fetchdata=await axios.get('http://localhost:3000/allpost')
    return fetchdata.data
}
const{data,isLoading,isError}=useQuery<apires>({
   queryKey:["sbrn",id],
   staleTime:1000*60*5,
   queryFn:gt
})

const {data:rr}=useQuery<gtall[]>({
queryKey:["allpost"],
staleTime:1000*60*5,
queryFn:gtall
})

if(isLoading){
    return <div className="loading-infinity"></div>
}
if(isError){
    return <h2 className="text-red-200">Error</h2>
}
return (
    <div className="flex">
        <div className="flex justify-center items-center">
            {data?.post &&( //for nested object
                <div key={data.post.id} className="border-base-300 bg-base-500">
<h2 className="text-bold">{data.post.title}</h2>
<h2 className="text-teal-600">{data.post.content}</h2>
                    </div>
            )}
        </div>
        <div className="flex justify-center items-center">
            {rr?.map((ele)=>( // for array of object or list of object 
                <div  className="">
<h2 className="text-red">{ele.title}</h2>
<h2 className="text-teal-500">{ele.content}</h2>
                    </div>
            ))}
        </div>
    </div>
)
}

export default Sr