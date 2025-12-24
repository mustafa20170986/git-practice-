import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import { useState } from "react"
import Postcard from "../components/postcard"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface Post {
    title: string 
    content: string
}

interface Getpost { 
    title: string 
    content: string 
    id: string
}

function Myprofile() {
    const [post, setPost] = useState<Post>({ title: "", content: "" })
    const queryclient = useQueryClient()
    const { getToken } = useAuth()

    // Function for getting post 
    const gt = async (): Promise<Getpost[]> => {
        const token = await getToken()
        try {
            const response = await axios.get("http://localhost:3000/get-post", {
                headers: { Authorization: `Bearer ${token}` }
            })
            return response.data
        } catch (error) {
            console.error(error)
            return []
        }
    }

    // 2. Query Hook cahing tansatck
    const { data, isLoading, isError } = useQuery<Getpost[]>({
        queryKey: ['sbrn'],
        queryFn: gt,
        staleTime: 1000 * 60 * 5
    })

    // 3. Delete Function 
    const deletpost = async (id: string) => {
        const token = await getToken()
        await axios.delete('http://localhost:3000/delete-post', {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: id }
        })
    }
// tanstack mutations
    const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
        mutationFn: deletpost,
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["sbrn"] })
        }
    })

    // 4. Create Function 
    const senddata = async (newPost: Post) => {
        const token = await getToken()
        const response = await axios.post("http://localhost:3000/create-post", newPost, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    }
//Mutation (Optimistic)
    const { mutate: createMutate, isPending: isCreating } = useMutation({
        mutationFn: senddata,
        onMutate: async (newpost) => {
            await queryclient.cancelQueries({ queryKey: ["sbrn"] })
            const previous = queryclient.getQueryData<Getpost[]>(["sbrn"])
            
            queryclient.setQueryData(["sbrn"], (olddata: Getpost[] | undefined) => {
                const optimisticPost = { ...newpost, id: Date.now().toString() }
                return [...(olddata || []), optimisticPost]
            })
            return { previous }
        },
        onError: (err, newpost, context) => {
            queryclient.setQueryData(["sbrn"], context?.previous)
        },
        onSettled: () => {
            setPost({ title: "", content: "" }) // Clear form
            queryclient.invalidateQueries({ queryKey: ["sbrn"] })
        }
    })

    // UI Guards
    if (isError) return <h2 className="text-red-500 text-center mt-10">Something went wrong. Please try again.</h2>
    if (isLoading) return <div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>

    return (
        <div className="flex flex-col gap-4 justify-center items-center p-4">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="flex flex-col gap-2 border border-base-300 p-6 rounded-xl shadow-md w-full max-w-md items-center">
                <input 
                    type="text" 
                    placeholder="Title of your blog" 
                    className="input input-bordered w-full"
                    value={post.title} 
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                />
                <textarea 
                    placeholder="Write anything you want..."
                    className="textarea textarea-bordered h-40 w-full"
                    value={post.content} 
                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                />
                <button 
                    className="btn btn-primary w-full" 
                    onClick={() => createMutate(post)}
                    disabled={isCreating}
                >
                    {isCreating ? "Posting..." : "POST"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mt-6">
                {data?.map((ele) => (
                    <Postcard 
                        key={ele.id} 
                        id={ele.id}
                        tit={ele.title} 
                        cont={ele.content}
                        handledelete={(id) => deleteMutate(id)}
                    />
                ))}
            </div>
            
            {/* Show a global indicator if deleting */}
            {isDeleting && <div className="toast toast-end"><div className="alert alert-info">Deleting...</div></div>}
        </div>
    )
}

export default Myprofile