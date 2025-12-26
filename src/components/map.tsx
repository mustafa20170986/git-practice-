import { useForm } from "@tanstack/react-form"


interface rn{
 name:string 
bio:string 
}

const defaultval:rn={
 name:"", bio:""
}


function Rf(){
    const form=useForm({
        defaultValues:defaultval,
        onSubmit:async({value})=>{
            console.log(value)
        }
    })

    return (
        // 1. Outer Container: Ensures the whole form is centered vertically and horizontally on the screen
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            
            <form 
                className="flex flex-col gap-6 p-8 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md" 
                onSubmit={(e)=>{
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <h1 className="text-2xl font-bold text-gray-800">User Data Form</h1>

                <form.Field 
                name="name"
                validators={{
                    onChange:({value})=>
                        value.length > 3 ? undefined : "Name should be 3 characters at least"
                }}
                children={(field)=>{
                    const{isDirty,isTouched,isPristine,errors}=field.state.meta
                    const hasError=errors.length > 0
                    const showError = hasError && isTouched
                    
                    return (
                        // 2. Inner Field Container: Ensures label and input stack vertically and align
                        <div className="flex flex-col gap-1">
                            <label htmlFor={field.name} className="font-medium text-gray-700">Name: </label>
                            <input 
                                type="text"
                                value={field.state.value}
                                onChange={(e)=>field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                // 3. Styling: Standard input padding, border, and conditional error styling
                                className={`p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 transition duration-150 
                                    ${showError ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            
                            {showError && (
                                <em className="text-red-500 text-sm mt-1">{errors[0]}</em>
                            )}
                            
                            {/* Optional status messages below */}
                            <div className="text-xs mt-1 space-x-2">
                                {isDirty && <em className="text-indigo-500" >Dirty</em>}
                                {isTouched && <em className="text-teal-500">Touched</em>}
                                {isPristine && <em className="text-fuchsia-500">Pristine</em>}
                            </div>
                        </div>
                    )
                }}
                />


                <form.Field 
                name="bio"
                validators={{
                    onChange:({value})=>{
                        if(value.length === 0){
                            return "Bio is required"
                        }
                        // Corrected logic: Checking if length exceeds 150
                        if(value.length > 150){
                            return "Bio must be within 150 characters"
                        }
                        return undefined // Pass validation if neither condition fails
                    }
                }}
                children={(field)=>{
                    const{isTouched,errors}=field.state.meta 
                    const hasError=errors.length > 0
                    const showError = hasError && isTouched

                    return ( 
                    // 2. Inner Field Container
                    <div className="flex flex-col gap-1">
                        <label htmlFor={field.name} className="font-medium text-gray-700"> Bio: </label>
                        <textarea 
                            value={field.state.value}
                            onChange={(e)=>field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            // 3. Styling: Applied standard styling to textarea
                            className={`p-2 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-indigo-200 transition duration-150
                                ${showError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {showError &&(
                            <em className="text-red-600 text-sm mt-1 font-semibold">{errors[0]}</em>
                        )}
                    </div>
                    )
                }}
                />
                
                {/* 4. Button Styling */}
                <button 
                    className="p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150" 
                    type="submit"
                >
                    Submit
                </button>

            </form>
        </div>
    )
}
export default Rf