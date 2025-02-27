package com.pg.PalashGarg007.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pg.PalashGarg007.pojo.Book;
import com.pg.PalashGarg007.service.BookService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/getAllBooks/genere={genre}")
    public List<Book> getAllBooks(@PathVariable(required = false) String genre) {
        return bookService.getAllBooks(genre);
    }
    
    @GetMapping("/getBookById/id={id}")
    public Book getBookById(@PathVariable(required = false) String id) {
        return bookService.getBookById(id);
    }
    
    @PostMapping("/addBook")
    public ResponseEntity<String> addBook(@RequestBody Book newBook) {
        bookService.addBook(newBook);
        
        return new ResponseEntity<>(
        		"Book added successfully!", 
        		HttpStatus.CREATED
        );
    }
    
    @PutMapping("/{id}/rating")
    public ResponseEntity<String> updateBookRating(
    		@PathVariable String id,
    		@RequestParam double rating)
    {
        boolean updated = bookService.updateBookRating(id, rating);
        
        return (updated) ? 
        		new ResponseEntity<>("Book rating updated successfully!", HttpStatus.OK) : 
        		new ResponseEntity<>("Book not found!", HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        return bookService.getStatistics();
    }
    
}
