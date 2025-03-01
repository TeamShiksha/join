"use client"
import Image from "next/image";
import {data} from "@/books"
import { useEffect, useState } from "react";

const uniqueGenres = [
  "Classic",
  "Fiction",
  "Dystopian",
  "Fantasy",
  "Historical Fiction",
  "Post-Apocalyptic",
  "Thriller",
  "Science Fiction",
  "Non-fiction",
  "Memoir"
];

const sortTypes=[
  "title",
  "author",
  "publicationYear"
]




type Book ={

    id: string,
    title: string,
    author: string,
    publicationYear: number,
    genre: string,
    rating: number,
    description: string,
    metadata?: {
      pages: number,
      stockLeft: number,
      price: number,
      discount: number,
      edition: number
  
  }
}



export default function Home() {

  const [genreFilter,setGenreFilter]=useState<string |null>()
  const [ratingFilter,setRatingFilter]=useState<number |null>(null)
  const [sortType,setSortType]=useState<string|null>(null)
  const [books,setBooks]=useState(data)
  const handleFilter=(genre:string)=>{
      setGenreFilter(genre);
  }



  const handleSort=(type:string)=>{
      setSortType(type)
  }

  useEffect(()=>{
    let filteredBooks =data
    
    if(genreFilter && genreFilter!=""){
      filteredBooks=data.filter((book)=>(
        book.genre===genreFilter
      ))
    }

    if(sortType){
     // console.log(sortType)
      if(sortType=="title")
      filteredBooks.sort((b1,b2) =>b1.title.localeCompare(b2.title))

      else if(sortType=="author"){
        filteredBooks.sort((b1,b2) =>b1.author.localeCompare(b2.author))
      }
      else if(sortType=="publicationYear"){
        filteredBooks.sort((b1,b2) =>b1.publicationYear - b2.publicationYear)
        console.log(sortType)
      }

      
    }
    //console.log(filteredBooks)
    console.log(genreFilter)

    setBooks(filteredBooks)

  },[genreFilter,sortType])

  return (

    <div className="w-full ">
      <div className="bg-white rounded-lg text-black w-full  items-center justify-center flex-col p-5">
          <select onChange={(e)=>handleSort(e.target.value)}>
              {
                sortTypes.map((type,index)=>(
                  <option key={index} value={type}>{type}</option>
                ))
              }
          </select>
          <select onChange={(e)=>handleFilter(e.target.value)}>
          <option value={""}>All</option>

              {
                uniqueGenres.map((genre,index)=>(
                  <option key={index} value={genre}>{genre}</option>
                ))
              }
          </select>
          
      </div>
   <div className="w-full flex flex-col gap-2 p-4 ">
      {
        books.map((book:Book)=>(
          <div key={book.id} className="bg-white rounded-lg text-black w-full  items-center justify-center flex-col p-5">
          <h1 className="font-bold text-xl">{book.title}</h1>
            <p>{book.author}</p>
            <p>{book.publicationYear}</p>
            <p>{book.genre}</p>
            <p>{book.rating}</p>
            <p>{book.description}</p>
      
        </div>
  
        ))
        
      }
   </div>
   </div>
  );
}
