import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];   // <-- FIXED
}

const pagelimit = 10;

function Poke() {
  const getthedata = async (page: number): Promise<PokemonRes> => {
    const offset = (page - 1) * pagelimit;
    const { data } = await axios.get<PokemonRes>(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pagelimit}`
    );
    return data;
  };

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["emuh", page],
    queryFn: () => getthedata(page),

    // FIXED placeholderData key
    placeholderData: {
      count: 0,
      next: null,
      previous: null,
      results: Array(pagelimit).fill({
        name: "loading...",
        url: "",
      }) as Pokemon[],
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <h2 className="text-red">error occurred</h2>;
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.results.map((ele, index) => {
          // Extract ID from url for images (or placeholder)
          const id = ele.url.split("/").filter(Boolean).pop();
          const img = id
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            : "https://via.placeholder.com/80"; // placeholder

          return (
            <div
              key={data.count === 0 ? `placeholder-${index}` : ele.name}
              className="card bg-base-100 shadow-xl"
            >
              <figure>
                <img src={img} alt={ele.name} />
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize">{ele.name}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!data?.previous}
        >
          Prev
        </button>

        <button
          className="btn btn-accent"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Poke;