import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import Mut from "./mutations"

interface product{
id:number,
title:string,
price:number,
thumbnail:string
}

interface productres{
    total:number,
    skip:number,
    limit:number,
    products:product[]
}
const limit=10

function Pagi(){
    const[page,setPage]=useState(1)
//const[innerlaoding,setInnerloading]=useState(false)
    const getdata=async(page:number):Promise<productres>=>{

        const skip=(page-1)*limit
        const {data}=await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
        return data
    }

    const{isLoading,isError,data,}=useQuery({
        queryKey:["product-suborna-love",page],
        staleTime:1000*60*5,
        queryFn:()=>getdata(page),
        placeholderData:(prevdata)=>{
            if(prevdata){
                return prevdata
            }
            return {
            products:Array(limit).fill({
                id:0,
             title:"Loading",
price:0,
thumbnail:""

            }) as product[],
            total:0,
            skip:0,
            limit:limit
        }
    }
    })

    if(isLoading){
        return <div className="loading-spinner"></div>
    }
    if(isError){
        return <h2 className="text-teal-300">Error occoured</h2>
    }
    return(
        <div className="p-10">
            <div className="grid grid-cols-3">
{data?.products.map((ele,item)=>(
    <div key={ele.id=== 0 ?  `palceholder-${item}`:ele.id} className="card"
    >
        <figure>
            <img src={ele.thumbnail} alt="image"/>
        </figure>
        <div className="card-body">
          <div className="card-title">
<h2 className="text-base-300">{ele.title}</h2>
<span className="font-bold">{ele.price}</span>
            </div>
            </div>
        </div>
))}
<div className="flex justify-center">
    <button className="btn btn-secondary" onClick={()=>setPage((p)=>Math.max(p-1,1))}
        >Prev</button>

        <button className="btn bnt-accent" onClick={()=>(setPage((p)=>p+1))}  disabled={data && (page*limit >= data.total)} >Next</button>
</div>
                </div>
                <Mut/>
            </div>
    )
}
export default Pagi