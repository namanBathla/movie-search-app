import React, { useEffect, useState } from "react";

function Card({
  imdbID,
  title,
  type,
  genre,
  rating,
  posterUrl,
  onLoadFunc,
  year,
}) {

  const titleArray = title.split(" ");
  let wikiUrl = "https://en.wikipedia.org/wiki/";
  for(let i = 0; i < titleArray.length; i++) {
    wikiUrl = wikiUrl + titleArray[i];
    if(i == titleArray.length - 1) continue;
    wikiUrl += "_";
  }

  return (
    <>
    <a className="appearance-none" href={wikiUrl} target="_blank">
      <div className="card flex flex-col justify-between rounded-md p-2 gap-2 bg-slate-900 ">
        <div className="img w-full h-80">
          <img
            className="poster h-full w-full rounded-t-md object-fill"
            src={posterUrl == "" ? null : posterUrl}
            alt={`${title} movie poster`}
            onLoad={onLoadFunc}
            onError={onLoadFunc}
          />
        </div>
        <p className="title font-bold leading-5">{title}</p>
        <p className="leading-4 "><span className="font-bold">Type: </span>{type}</p>
        <p className="leading-4"><span className="font-bold">Genre: </span>{genre}</p>
        <p className="leading-4 "><span className="font-bold">Rating: </span>{rating}</p>
        <p className="leading-4 "><span className="font-bold">Year: </span>{year}</p>
        <p className="leading-4 "><span className="font-bold">IMDB ID: </span>{imdbID}</p>
      </div>
    </a>
      
    </>
  );
}

// function Card({ imdbID, onLoadFunc }) {
//   const apiKey = "97aed2e3";
//   const searchUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
//   const [posterUrl, setposterUrl] = useState("");
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("");
//   const [genre, setGenre] = useState("");
//   const [rating, setRating] = useState("");

//   useEffect(() => {
//     fetch(searchUrl)
//       .then((res) => res.json())
//       .then((data) => {
//         setposterUrl(data.Poster);
//         setTitle(data.Title);
//         setType(data.Type);
//         setGenre(data.Genre);
//         setRating(data.imdbRating);
//       });
//   }, [imdbID]);
//   // Add dependency on imdbID (even though it won’t change, it's a good practice)

//   return (
//     <>
//       <div className="card flex flex-col rounded-md p-2">
//         <div className="img min-h-3/4">
//           <img
//             className="poster h-full rounded-t-md object-cover"
//             src={posterUrl == "" ? null : posterUrl}
//             alt={`${title} movie poster`}
//             onLoad={onLoadFunc}
//             onError={onLoadFunc} // if image fails to load, count it as loaded anyway
//           />
//         </div>
//         <div className="title font-bold text-wrap">{title}</div>
//         <div className="details flex flex-col gap-2 justify-between">
//           {/* <div>ImdbID: {imdbID}</div> */}
//           <div className="text-wrap">Type: {type}</div>
//           <div className="text-wrap">Genre: {genre}</div>
//           <div className="text-wrap">Rating: {rating}</div>
//         </div>
//       </div>
//     </>
//   );
// }

export default Card;
