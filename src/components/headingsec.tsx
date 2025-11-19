import { useState} from "react";
import Button from "./button";

// Interface defining the structure of a single task object
interface Task{
    textt:string // The actual text content of the task
    id:number    // Unique identifier, crucial for mapping and editing
}


function Heading(){
    // STATE 1: Controls the visibility of the "Add New Task" input form (boolean)
    const[clicked,setClicked]=useState(false) 
    
    // STATE 2: Holds the text currently being typed into the *NEW TASK* input field (string)
    const [text,setText]=useState("") 
    
    // STATE 3: The main array that holds all saved tasks (array of Task objects)
    const[save,setSave]=useState<Task[]>([]) 
    
    // STATE 4 (FIX for multi-edit bug): Tracks the ID of the ONE task currently in edit mode (number or null)
    const[isedit,setEdit]=useState<number |null>(null) 
    
    // STATE 5 (FIX for same-text bug): Holds the text currently being typed into the *EDIT* input field (string)
    const [edit,saveEdit]=useState("") 

    // HANDLER: Toggles the visibility of the new task input form
    const handleclick=()=>{
        setClicked(true)
        setText("") // Good practice: ensure the input is clear when opened
    }

    // HANDLER: Logic for ADDING a new task to the 'save' array
    const handlesave=()=>{
        if(text.trim()==="")return // Prevents saving empty tasks

        const newtask:Task={
            textt:text,
            id:Math.random() // Generates a unique ID for the new task
        }
        setSave([...save,newtask]) // Appends the new task to the array
        setClicked(false)          // Hides the input form
        setText("")                // Clears the new task input
    }

    // HANDLER: Initiates the edit mode for a specific task
    const handleedit=(id:number,taskText:string)=>{
       setEdit(id)          // Sets isedit to the ID of the task being edited (toggles mode for this item)
       saveEdit(taskText)   // Loads the current text into the temporary 'edit' state
    }

    // HANDLER: Logic for UPDATING an existing task and exiting edit mode
    const updtedit=(id:number)=>{
        const up=save.map(task=>{
            if(task.id===id){
                // FIX: Spreads the *single task* object and overwrites its 'textt' property
                //      using the temporary 'edit' state value.
                return{...task,textt:edit.trim()} 
            }
            return task // Returns unchanged tasks
        })
        setSave(up)         // Updates the main tasks array with the edited version
        setEdit(null)       // Exit edit mode (set isedit back to null)
        saveEdit("")        // Clear the temporary edit state
    }

    return(
        <div className="flex flex-col justify-center items-center">
            
            {/* Header */}
            <div className=" flex flex-col justify-center items-center mt-4">
                <h2 className="text-base-content text-xl px-8 py-3 bg-teal-400  rounded-xl hover:shadow-lg">Task Manager</h2>
            </div>
            
            {/* Add Task Button */}
            <div className="flex gap-5 justify-center items-center mt-10 h-10 w-1/2 border-base-100 shadow-lg hover:shadow-teal-300">
                <h2 className="text-base-content text-lg ">Add Task</h2>
                <Button label={"+"} handler={handleclick}/>
            </div>
            
            {/* Conditional New Task Input Form */}
            {clicked && 
            (
                <div className="mt-4 flex-col justify-center items-center">
                    <input 
                        type="text" 
                        placeholder="Write your task" 
                        value={text} // BOUND: Binds to the NEW task state ('text')
                        onChange={(e)=>setText(e.target.value)} // HANDLER: Updates the NEW task state ('text')
                        className="border-base-100 shadow-lg w-full h-20 rounded-lg text-center"
                    />
                    <Button label={"Save"} handler={handlesave}/> // HANDLER: Calls the ADD NEW TASK logic
                </div>
            )}

            {/* Task List Container (Applies flex and gap for proper spacing) */}
            <div className="mt-6 flex flex-col justify-center items-center gap-4">
                {save.length===0 ?(
                    <h2 className="text-base-content text-xl">You havent Added any text yet</h2>
                ) : (
                    // MAPPING: Iterates over the 'save' array
                    save.map((ele)=>(
                        // Task Item Container (must have enough width classes for Tailwind to work)
                        <div key={ele.id} className="w-full max-w-md border shadow-lg hover:shadow-teal-200 flex justify-between items-center p-3 rounded-lg bg-white">
                            
                            {/* CONDITIONAL RENDERING: Check if the current task's ID matches the editing ID */}
                            {isedit===ele.id ?(
                                // RENDER: Edit Mode
                                <div className="flex gap-2 w-full items-center">
                                    <input 
                                        type="text" 
                                        value={edit} // BOUND: Binds to the EDITING text state ('edit')
                                        onChange={(e)=>saveEdit(e.target.value)} // HANDLER: Updates the EDITING text state ('edit')
                                        className="border border-indigo-400 p-1 rounded flex-grow h-8"
                                    />
                                    {/* FIX: Button must call UPDATEDIT with the specific task ID */}
                                    <Button label={"Save"} handler={()=>updtedit(ele.id)}/>
                                </div>
                            ):(
                                // RENDER: Display Mode
                                <p className="flex-grow text-left">
                                    {ele.textt}
                                </p>
                            )}

                            {/* Conditional Edit Button */}
                            {/* FIX: Show Edit button only if this task is NOT currently being edited */}
                            {isedit !== ele.id && (
                                // HANDLER: Calls handleedit with the specific ID and text
                                <Button label={"Edit"} handler={()=>handleedit(ele.id,ele.textt)}/>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default Heading