import { useQuery } from "@tanstack/react-query"
import axios from "axios"
//import { useParams } from "react-router-dom"

interface rn{
    content:string 
    title:string
id:number
}

function Real(){
  
    const gt=async():Promise<rn[]>=>{

        const getdata=await axios.get('http://localhost:3000/allpost')
        return getdata.data
    }

    const {data,isLoading,isError,isFetching,refetch}=useQuery({
        queryKey:["Suborna"],
        staleTime:1000*60*5,
        refetchOnWindowFocus:true,
        queryFn:gt
    })

    if(isLoading){
       return <div className="loading-spinner"></div>
    }
    if(isError){
        return <h2 className="text-red-400">Error occoured</h2>
    }

    return (
        <div className=" feldx flex-col ">
            {isFetching && (
               <span>
                refreshing...
               </span>
            )}

            <button className="btn bnt-secondary btn-outline" onClick={()=>refetch()}>reffresh</button>
            {data?.map((ele)=>(
                <div key={ele.id}>
<div className="border border-indigo-300 rounded-xl w-1/2">
<h1 className="text-pink-300">
    {ele.title}
</h1>
<h2 className=" text-teal-200">
    {ele.content}
</h2>
    </div>
                    </div>
            ))}
        </div>
    )
}
export default Real