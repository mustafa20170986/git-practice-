import { useForm } from "@tanstack/react-form"
import axios, { isAxiosError } from "axios"

interface Rn{
    name:string 
    bio:string 
}

const defaultvalue:Rn={
    name:"",
    bio:""
}

function Def(){
    const form=useForm({
        defaultValues:defaultvalue,
        onSubmit:async({value})=>{
            console.log(value)
        }
    })

    const checknaem=async({value} :{value:string})=>{
        try{
await axios.post('http://localhost:3000/checkname',{
 userName:value


})
return undefined
        }catch(error: unknown){
            if(isAxiosError(error) && error.response){
            if(error.response && error.response.status===409){
                return "nake already taken"
            }
        }
            console.log(error)
        }
    }

    return (
        <div className="flex felx-col min-h-screen justify-center items-center">
        <form 
        className="flex flex-col gap-2 p-8 w-max max-w-md border-base-100 shadow-lg hover:shadow-indigo-300"
        onSubmit={(e)=>{
            e.preventDefault()
            form.handleSubmit()
            
        }}
        >
{/* field for Nmae*/}
<form.Field 
name="name"
validators={{
    onBlur:({value})=>
        value.length===0 ? "name is required" :undefined,
    onChange:({value})=>
        value.length < 3 ?" name cannot be less than three charecter":undefined,
 onChangeAsync:checknaem,
 onChangeAsyncDebounceMs:500
}}
children={(field)=>(
    <div className=" flex felx-col gap-2">
    <label htmlFor={field.name}>Name: </label>
    <input 
    type="text"
    value={field.state.value}
    onChange={(e)=>field.handleChange(e.target.value)}
onBlur={field.handleBlur}
className="bg-indigo-200 rounded-xl"
/>
{!field.state.meta.isValid &&(
    <em className="text-red-400">
        {field.state.meta.errors.join(',')}
    </em>
)}
    </div>
)}
/>

{/* filed forn bio */}

<form.Field
name="bio"
validators={{
    onChange:({value})=>
        value.length===0 ? "must be write something" :undefined
}}
children={(field)=>(
    <div className="flex flex-col gap-2">
        <label htmlFor={field.name}>Bio: </label>
        <textarea 
        value={field.state.value}
        onChange={(e)=>field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="resize-none bg-pink-300 border-none  rounded-xl"
        />
        {!field.state.meta.isValid &&(
            <em className="text-red-400 ">
                {field.state.meta.errors.join(',')}
            </em>
        )}
            </div>
)}
/>

<button type="submit" className="btn bnt-soft bg-white text-pink-500  border-pink-400 hover:bg-pink-500 hover:text-white">Submit</button>
        </form>
        </div>
    )
}
export default Def