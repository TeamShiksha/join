<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BooksControler;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/books', [BooksControler::class, 'getAllBooks']);
Route::get('/books/{id}',[BooksControler::class, 'getBook']);
Route::post('/books',[BooksControler::class, 'addBook']);
Route::post('/books/{id}',[BooksControler::class, 'updateRating']);
Route::get('/statistics',[BooksControler::class, 'getStatistics']);

