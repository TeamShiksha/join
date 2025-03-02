<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class BooksControler extends Controller
{
    //helper funtion to get json data content from storage and validations
    private function getBooksContent() {
        $path = storage_path('app/books.json');
    
        if (!file_exists($path)) {
            return ['error' => 'Cannot connect to the database (Json File)', 'status' => 404];
        }
    
        $eventsContent = file_get_contents($path);
        $eventsContent = json_decode($eventsContent, true);
    
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['error' => 'Error occurred while json decode', 'status' => 400];
        }

        //show only the non-soft deleted events
        $eventsContent = array_filter($eventsContent, function($event) {
            return empty($event['deleted']);
        });
    
        return $eventsContent;
    }

    //to get all bokks or if gre mentioned then only for that genre
    public function getAllBooks(Request $request) {
        $genre = $request->input('genre');
        $booksContent = $this->getBooksContent();

        if (isset($booksContent['error'])) {
            return response()->json($booksContent, $booksContent['status']);
        }

        if($genre){
            $booksContent = array_filter($booksContent, function($book) use ($genre) {
                return isset($book['genre']) && stripos($book['genre'], $genre) !== false;
            });
        }

        return response()->json(['message' => 'Books retrieved', 'books' => array_values($booksContent)], 200);
    }

    //to get book buy id:
    public function getBook($id){

        $booksContent = $this->getBooksContent();

        if (isset($booksContent['error'])) {
            return response()->json($booksContent, $booksContent['status']);
        }

        $book = collect($booksContent)->firstWhere('id',$id);

        if(!$book){
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json(['message'=>'BOOK FOUND','book'=>$book],200);
    }

    //to add a book:
    public function addBook(Request $request){

        try{
            $validateBook = $request->validate([
                'title'=>'required|string|min:3|max:255',
                'author' => 'required|string|max:255',
                'publicationYear' => 'required|integer',
                'genre' => 'required|string|max:255',
                'rating' => 'required|numeric|min:1|max:5',
                'description' => 'required|string|max:255',
                'metadata.pages' => 'required|integer',
                'metadata.stockLeft' => 'required|integer',
                'metadata.price' => 'required|numeric',
                'metadata.discount' => 'required|integer|min:0|max:100',
                'metadata.edition' => 'required|integer',
            ]);
    
            if(!$validateBook){
                return response()->json(['message'=>'Invalid Data'],400);
            }
    
            $booksContent = $this->getBooksContent();
    
            if (isset($booksContent['error'])) {
                return response()->json($booksContent, $booksContent['status']);
            }
    
            //adding this as this is json so getting count of alll books and the adding 1 to make the new id;
            $newId = count($booksContent) +1;
    
            $newBook = [
                'id' => $newId,
                'title' => $validateBook['title'],
                'author' => $validateBook['author'],
                'publicationYear' => $validateBook['publicationYear'],
                'genre' => $validateBook['genre'],
                'rating' => $validateBook['rating'],
                'description' => $validateBook['description'],
                'metadata' => [
                    'pages' => $validateBook['metadata']['pages'],
                    'stockLeft' => $validateBook['metadata']['stockLeft'],
                    'price' => $validateBook['metadata']['price'],
                    'discount' => $validateBook['metadata']['discount'],
                    'edition' => $validateBook['metadata']['edition'],
                ]
            ];
    
            $booksContent[] = $newBook;
    
            $path = storage_path('app/books.json');
            file_put_contents($path,json_encode($booksContent,JSON_PRETTY_PRINT));
    
            return response()->json(['message'=>'Book Added','book'=>$newBook],201);
        } catch (Exception $e) {
            \Log::error('Error occurred in addBook: ' . $e->getMessage());
            return response()->json(['message' => 'Error while saving book', 'error' => $e->getMessage()], 500);
        }
        

    }

    //to update the rating by id :
    public function updateRating(Request $request,$id){

        try{
            $validateBook = $request->validate([
                'rating' => 'required|numeric|min:0|max:5',
            ]);
    
            if(!$validateBook){
                return response()->json(['error' => 'Please enter ratings between 0-5 and should be a number'], 400);
            }
    
            $booksContent = $this->getBooksContent();
            if (isset($booksContent['error'])) {
                return response()->json($booksContent, $booksContent['status']);
            }
    
            $book = collect($booksContent)->firstWhere('id', $id);
            if (!$book) {
                return response()->json(['error' => 'Book not found / Not Available'], 404);
            }
    
            $book['rating'] = $request->rating;
            $updatedBooksContent = collect($booksContent)->map(function ($item) use ($book) {
                return $item['id'] === $book['id'] ? $book : $item;
            })->toArray();
    
            $path = storage_path('app/books.json');
            file_put_contents($path, json_encode($updatedBooksContent, JSON_PRETTY_PRINT));
            return response()->json(['message' => 'Rating Updated', 'book' => $book], 200);
        }
        catch (Exception $e) {
            \Log::error('Error occurred in updateRating: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    //to get the statistics of the books content:

    public function getStatistics(){
        try{
            
            $booksContent = $this->getBooksContent();
            if (isset($booksContent['error'])) {
                return response()->json($booksContent, $booksContent['status']);
            }

            $ratingsByGenre = [];
            $countByGenre = [];

            foreach ($booksContent as $book) {
                if (!isset($ratingsByGenre[$book['genre']])) {
                    $ratingsByGenre[$book['genre']] = 0;
                    $countByGenre[$book['genre']] = 0;
                }
                $ratingsByGenre[$book['genre']] += $book['rating'];
                $countByGenre[$book['genre']] += 1;
            }

            $averageRatingsByGenre = [];
            foreach ($ratingsByGenre as $genre => $totalRating) {
                $averageRatingsByGenre[$genre] = $totalRating / $countByGenre[$genre];
            }

            $bookColection = collect($booksContent);
            $oldBook = $bookColection->sortBy('publicationYear')->first();
            $newBook = $bookColection->sortByDesc('publicationYear')->first();

            return response()->json([
                'message' => 'Statistics retrieved',
                'averageRatingsByGenre' => $averageRatingsByGenre,
                'oldestBook' => $oldBook,
                'newestBook' => $newBook
            ], 200);
 
        }catch(Exception $e){
            \Log::error('Error occurred in getStatistics: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
