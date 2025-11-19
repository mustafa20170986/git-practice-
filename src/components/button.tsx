interface Buttonint{
    label:string 
    handler:()=>void
}

function Button({label,handler}:Buttonint){
return(
<div className="buttonclass">
    <button className="btn btn-accent px-8 py-2 hover:shadow-lg rounded-lg" onClick={handler}>{label}</button>
</div>

)
}
export default Button