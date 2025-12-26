import { useReducer, type ChangeEvent, type FormEvent } from "react";

// Define the form fields interface
interface FormFields {
  name: string;
  id: string;
  bio: string;
  year: number;
  college: string;
  cuteness: boolean;
  smile: string;
  speciality: string;
  dreamwithher: string;
  affection: number;
}

// Metadata for form fields (for rendering dynamically)
interface FieldMeta {
  label: string;
  name: keyof FormFields;
  type: string;
  placeholder?: string;
}

// Action type for reducer
type Action =
  | { type: "CHANGE_FIELD"; fieldname: keyof FormFields; value: string | boolean | number }
  | { type: "RESET" };

// Initial state
const initialState: FormFields = {
  name: "",
  id: "",
  bio: "",
  year: 0,
  college: "",
  cuteness: false,
  smile: "",
  speciality: "",
  dreamwithher: "",
  affection: 0,
};

// Reducer function (pure function, no hooks inside!)
function formReducer(state: FormFields, action: Action): FormFields {
  switch (action.type) {
    case "CHANGE_FIELD":
      return {
        ...state,
        [action.fieldname]: action.value,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Field configuration for dynamic rendering
const fields: FieldMeta[] = [
  { label: "Name", name: "name", type: "text", placeholder: "Your crush's name" },
  { label: "ID", name: "id", type: "text", placeholder: "Student ID" },
  { label: "Bio", name: "bio", type: "text", placeholder: "Tell us about her" },
  { label: "Year", name: "year", type: "number", placeholder: "e.g., 2" },
  { label: "College", name: "college", type: "text", placeholder: "Her college" },
  { label: "Is she cute?", name: "cuteness", type: "checkbox" },
  { label: "Her smile (describe)", name: "smile", type: "text" },
  { label: "Speciality", name: "speciality", type: "text", placeholder: "What makes her special?" },
  { label: "Dream with her", name: "dreamwithher", type: "text", placeholder: "Your dream future" },
  { label: "Affection Level (0-100)", name: "affection", type: "number" },
];

export default function CrushForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted! 💕", state);
    alert("Your crush has been officially documented! 😍");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    let parsedValue: string | boolean | number = value;

    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      parsedValue = value === "" ? 0 : Number(value);
    }

    dispatch({
      type: "CHANGE_FIELD",
      fieldname: name as keyof FormFields,
      value: parsedValue,
    });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
        My Crush Application Form ❤️
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pink-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  {field.label}
                </span>
              </label>

              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={state[field.name] as boolean}
                  onChange={handleChange}
                  className="checkbox checkbox-lg checkbox-pink"
                />
              ) : field.name === "bio" || field.name === "dreamwithher" ? (
                <textarea
                  name={field.name}
                  value={state[field.name] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="textarea textarea-bordered textarea-lg w-full"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.type === "number"
                      ? (state[field.name] as number)
                      : (state[field.name] as string)
                  }
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="input input-bordered input-lg w-full"
                  min={field.name === "affection" ? 0 : undefined}
                  max={field.name === "affection" ? 100 : undefined}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4 justify-center">
          <button type="submit" className="btn btn-lg btn-secondary">
            Submit My Love 💌
          </button>
          <button type="button" onClick={handleReset} className="btn btn-lg btn-ghost">
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}