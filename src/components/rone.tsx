//import { useQuery } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
//import { useNavigate } from "react-router-dom"

interface rn{
    id:number 
    name:string 
    year:number 
}

interface str{
    id:number 
    name:string 
    details:string
}

function  Namelist(){

    const getlove=async():Promise<rn[]>=>{
        const getdata=await axios.get("http://localhost:3000/love")
        if(getdata.status===200){
            console.log("okay")
        }
        return getdata.data
    }


    const getdetails=async():Promise<str[]>=>{
        const getinfo=await axios.get("http://localhost:3000/data-of-love")
        if(getinfo.status===200){
            console.log("oaky for 2")
        }
        return getinfo.data
    }

    const love =useQuery({
queryKey:["love-suborna"],
staleTime:1000 * 60 * 5,
queryFn:getlove
    })

    const detailsquer=useQuery({
        queryKey:["details-love-suborna"],
        staleTime:1000 * 60 * 5,
        queryFn:getdetails
    })

    const isloaidng=love.isLoading || detailsquer.isLoading
const isError =love.isError || detailsquer.isError

const loedata=love.data
const detrix=detailsquer.data
if(isloaidng){
    return <div className="laoding-spinner"></div>
}
if(isError){
    return <h1 className=" text-red-400">Error</h1>
}
return (
    <div className="flex flex-col">
        {loedata?.map((ele)=>(
            <div key={ele.id}>
<h2 className="text-pink-400">{ele.name}</h2>
<h2 className="text-pink-400">{ele.year}</h2>

                </div>
        ))}

        <div className="divider">
            {detrix?.map((ele)=>(
                <div key={ele.id}>
<h2 className="text-indigo-400">{ele.name}</h2>
<h2 className="text-indigo-400">{ele.details}</h2>

                    </div>
            ))}
        </div>
    </div>
)
    
}
export default Namelist