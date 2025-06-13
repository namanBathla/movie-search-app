import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import Card from "./components/Card";
import { ClipLoader } from "react-spinners";

const App = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [moviesCopy, setMoviesCopy] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [typeOfSort, setTypeOfSort] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterValue, setFilterValue] = useState("");

  //   const movieUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
  //    https://www.omdbapi.com/?apikey=97aed2e3&i=
  const apiKey = "97aed2e3";
  const searchUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${input}`;
  useEffect(() => {
    document.title = "Movie Search App";
  }, []);

  useEffect(() => {
    if (loadedCount == movies.length && movies.length > 0) {
      setIsLoading(false);
    }
    // console.log("Some values changed");
    setFilterCategory("");
    setTypeOfSort("");
  }, [loadedCount, movies.length]);

  const handleSubmit = () => {
    setIsLoading(true);
    let ids = [];
    fetch(searchUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) {
          ids = data.Search.map((movie) => movie.imdbID);
          console.log(ids);

          // Returns a single promise that resolves to
          // an array of results (in the same order as the input promises)
          // much faster than await inside a loop
          return Promise.all(
            ids.map((id) =>
              fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`).then(
                (res) => res.json()
              )
            )
          );
        } else {
          setMovies([]);
          // setIsLoading(false); // It runs after data is set
          return [];
        }
      })
      .then((dataArray) => {
        const sorted = [...dataArray].sort(
          (a, b) => parseInt(b.imdbID.slice(2)) - parseInt(a.imdbID.slice(2))
        );
        // console.log(sorted);
        setMovies(sorted);
        setMoviesCopy(sorted);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setIsLoading(false); // Handle error case
      });

    /* Promise.all() — What it Does:
Promise.all() is a JavaScript method that takes an array of promises, and:
Runs them in parallel.
Waits for all of them to resolve (or reject).
Returns a single promise that:
Resolves to an array of results (in the same order as the input promises),
Or rejects immediately if any one of them fails. */
  };

  useEffect(() => {
    switch (typeOfSort) {
      case "i": {
        const imdbSorted = [...movies].sort(
          (a, b) => parseInt(b.imdbID.slice(2)) - parseInt(a.imdbID.slice(2))
        );
        setMovies(imdbSorted);
        break;
      }
      case "ra":
        sortByRating("a");
        break;
      case "rd":
        sortByRating("d");
        break;
      case "ya":
        sortByYear("a");
        break;
      case "yd":
        sortByYear("d");
        break;
      case "ta":
        sortByTitle("a");
        break;
      case "td":
        sortByTitle("d");
        break;
      default:
        break;
    }
  }, [typeOfSort]);

  const sortByRating = (order = "d") => {
    const sorted = [...movies].sort((a, b) => {
      const diff = parseFloat(a.imdbRating) - parseFloat(b.imdbRating);
      return order === "a" ? diff : -diff;
    });
    setMovies(sorted);
  };

  const sortByYear = (order = "d") => {
    const sorted = [...movies].sort((a, b) => {
      const diff = parseFloat(b.Year) - parseFloat(a.Year);
      return order === "a" ? diff : -diff;
    });
    setMovies(sorted);
  };
  const sortByTitle = (order = "d") => {
    const sorted = [...movies].sort((a, b) => {
      const diff = a.Title.localeCompare(b.Title);
      return order === "a" ? diff : -diff;
    });
    setMovies(sorted);
  };

  const handleGenreFilter = (g = "Comedy") => {
    console.log("COPY: ", moviesCopy);
    const filteredMovies = moviesCopy.filter((m) => m.Genre.includes(g));
    console.log(filteredMovies);
    setMovies(filteredMovies);
  };

  const handleRatingFilter = (r = 9.5) => {
    const filteredMovies = moviesCopy.filter((m) => parseFloat(m.imdbRating) > r);
    setMovies(filteredMovies);
  }
  
  const handleYearFilter = (y = 2020) => {
    const startYear = y;
    const endYear = y + 9;
    const year = parseInt(m.Year?.slice(0, 4));
    const filteredMovies = moviesCopy.filter((m) => year >= startYear && year <= endYear);
    setMovies(filteredMovies);
  }
  useEffect(() => {
    console.log("Filter by: " + filterCategory);
    console.log("FilterValue: ", filterValue);
    switch (filterCategory) {
      case "genre":
        handleGenreFilter(filterValue);
        break;
      case "rating":
        handleRatingFilter(filterValue);
        break;
      case "year":
        handleYearFilter(filterValue);
        break;
      default:
        break;
    }
  }, [filterValue]);

  return (
    <>
      <div className="screen w-full min-h-screen h-full flex flex-col gap-4 px-2 py-5 bg-slate-800 justify-center items-center">
        <p className="app-title font-bold text-5xl">Movie Search App</p>
        <div className="input-box flex flex-col items-center gap-5 self-center w-1/2 p-4">
          <input
            placeholder="Search a movie or a keyword"
            className="w-full p-2 border border-black outline-none rounded-md bg-slate-900 "
            type="text"
            name=""
            id=""
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            className="px-4 py-2  bg-blue-600 hover:bg-blue-500  rounded-md outline-none"
            onClick={handleSubmit}
          >
            {/* <CiSearch /> */}
            Search
          </button>
        </div>

        {/* Sort and filter section 
        Shown only when loading completes */}
        {movies.length > 0 && (
          <div className="filter-sort flex w-full justify-between px-10">
            <div className="sort flex gap-3 bg-slate-900 rounded-md p-2">
              {/* <p>Sort by</p> */}
              <select
                name="sort"
                id="sort"
                value={typeOfSort}
                className="outline-none bg-transparent cursor-pointer"
                onChange={(e) => {
                  setTypeOfSort(e.target.value);
                  // console.log(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Sort by
                </option>
                <option className="bg-slate-900 px-2" value="i">
                  IMDB ID
                </option>
                <option className="bg-slate-900 p-2" value="rd">
                  Rating (Highest First)
                </option>
                <option className="bg-slate-900" value="ra">
                  Rating (Lowest First)
                </option>
                <option className="bg-slate-900" value="ya">
                  Year (Newest First)
                </option>
                <option className="bg-slate-900" value="yd">
                  Year (Oldest First)
                </option>
                <option className="bg-slate-900" value="ta">
                  Title (A-Z)
                </option>
                <option className="bg-slate-900" value="td">
                  Title (Z-A)
                </option>
              </select>
            </div>

            {/* Filter box */}
            <div className="sort flex gap-3 bg-slate-900 rounded-md p-2">
              {/* <p>Filter by</p> */}
              <select
                name=""
                id=""
                value={filterCategory}
                className="outline-none bg-transparent cursor-pointer"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="" disabled selected>
                  Filter by
                </option>
                <option value="genre" className="bg-slate-900">
                  Genre
                </option>
                <option value="year" className="bg-slate-900">
                  Year
                </option>
                <option value="rating" className="bg-slate-900">
                  Rating
                </option>
              </select>

              {filterCategory !== "" && filterCategory === "genre" && (
                <select
                  name="genre"
                  id=""
                  className="bg-slate-900 outline-none"
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Genre
                  </option>
                  <option className="bg-slate-900" value="Comedy">
                    Comedy
                  </option>
                  <option className="bg-slate-900" value="Action">
                    Action
                  </option>
                  <option className="bg-slate-900" value="Drama">
                    Drama
                  </option>
                  <option className="bg-slate-900" value="Adventure">
                    Adventure
                  </option>
                  <option className="bg-slate-900" value="Thriller">
                    Thriller
                  </option>
                  <option className="bg-slate-900" value="Mystery">
                    Mystery
                  </option>
                  <option className="bg-slate-900" value="Romance">
                    Romance
                  </option>
                </select>
              )}

              {filterCategory !== "" && filterCategory === "rating" && (
                <select
                  name="genre"
                  id=""
                  className="bg-slate-900 outline-none"
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Rating
                  </option>
                  <option className="bg-slate-900" value={9.5}>
                    9.5+
                  </option>
                  <option className="bg-slate-900" value={9}>
                    9+
                  </option>
                  <option className="bg-slate-900" value={8.5}>
                    8.5+
                  </option>
                  <option className="bg-slate-900" value={8}>
                    8+
                  </option>
                  <option className="bg-slate-900" value={7.5}>
                    7.5+
                  </option>
                  <option className="bg-slate-900" value={7}>
                    7+
                  </option>
                </select>
              )}

              {filterCategory !== "" && filterCategory === "year" && (
                <select
                  name="genre"
                  id=""
                  className="bg-slate-900 outline-none"
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Year
                  </option>
                  <option className="bg-slate-900" value={2020}>
                    2020 - present
                  </option>
                  <option className="bg-slate-900" value={2010}>
                    2010 - 2019
                  </option>
                  <option className="bg-slate-900" value={2000}>
                    2000 - 2009
                  </option>
                  <option className="bg-slate-900" value={1990}>
                    1990 - 1999
                  </option>
                </select>
              )}
            </div>
          </div>
        )}

        {/* Cards Section */}
        <div className="cards-box w-full h-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-x-1 gap-y-7">
          {/* Loader Overlay */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-10">
              <ClipLoader size={50} color={"#36d7b7"} />
            </div>
          )}

          {movies.map((movie) => {
            return (
              <Card
                onLoadFunc={() => setLoadedCount((prev) => prev + 1)}
                imdbID={movie.imdbID.slice(2)}
                key={movie.imdbID}
                title={movie.Title}
                rating={movie.imdbRating}
                genre={movie.Genre}
                type={movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                posterUrl={movie.Poster}
                year={movie.Year}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default App;
