import { useForm } from "@tanstack/react-form"
import { z } from "zod"

const userrobj = z.object({
  name: z.string().min(3, "your name doesnt matchd"),
})

interface Data {
  name: string
  bio: string
  id: number
}

const defaultt: Data = {
  name: "set your name ",
  id: 0,
  bio: "softness and sharpness",
}

function Suborna() {
  const form = useForm({
    defaultValues: defaultt,
    validators: {
      onChange: ({ value }) => userrobj.safeParse(value),
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor={field.name}>Name:</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="border p-1"
              />

              {/* Show error */}
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
      </form>
    </div>
  )
}

export default Suborna
