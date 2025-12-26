import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function Mut(){
    const queryClient= useQueryClient()

const sendreq=async()=>{
    const senddata=await axios.post("http://localhost:3000/createuser"
     
    )
    return senddata.data
}

    const addmut=useMutation({
        mutationFn:sendreq,

        onSuccess:()=>{
        queryClient.invalidateQueries({
            queryKey:["users"]})
            
        }
    })
    return(
        <button className="btn btn-secondary" onClick={()=>addmut.mutate()}>Signin</button>
    )
    
    }
    export default Mut
