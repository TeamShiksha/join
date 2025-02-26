package com.pg.PalashGarg007.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pg.PalashGarg007.pojo.Book;

import java.io.File;
import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class BookService {
	private static final String FILE_PATH = "books.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Book> getAllBooks(String genre) {
        try {
            List<Book> books = objectMapper.readValue(
            	new File(FILE_PATH),
            	new TypeReference<List<Book>>() {}
            );

            if (genre != null && !genre.isEmpty()) {
                return books.stream()
                        .filter(book -> book.getGenre().equalsIgnoreCase(genre))
                        .collect(Collectors.toList());
            }
            
            return books;
            
        } catch (IOException e) {
            throw new RuntimeException("Error reading books from JSON file", e);
        }
        
    }
    
    public void saveBooks(List<Book> books) {
        try {
            objectMapper.writeValue(new File(FILE_PATH), books);
        } catch (IOException e) {
            throw new RuntimeException("Error writing books to JSON file", e);
        }
    }
    
    public Book getBookById(String id) {
        try {
            List<Book> books = objectMapper.readValue(
            	new File(FILE_PATH),
            	new TypeReference<List<Book>>() {}
            );

            if (id != null && !id.isEmpty()) {
                books = books.stream()
                        .filter(book -> book.getId().equalsIgnoreCase(id))
                        .collect(Collectors.toList());
            }
            
            return (books.isEmpty()) ? null : books.getFirst();
            
        } catch (IOException e) {
            throw new RuntimeException("Error reading books from JSON file", e);
        }
        
    }

    public void addBook(Book newBook) {
        List<Book> books = getAllBooks(null);
        books.add(newBook);
        saveBooks(books);
    }

    public boolean updateBookRating(String id, double newRating) {
        List<Book> books = getAllBooks(null);

        Optional<Book> bookOptional = books.stream()
                .filter(book -> book.getId().equals(id))
                .findFirst();

        if (bookOptional.isPresent()) {
            bookOptional.get().setRating(newRating);
            saveBooks(books);
            
            return true;
        }
        
        return false;
    }
    
    public Map<String, Object> getStatistics() {
        List<Book> books = getAllBooks(null);
        
        if (books.isEmpty()) {
            return Map.of("message", "No books available for statistics.");
        }

        Map<String, Double> avgRatingByGenre = books.stream()
                .collect(Collectors.groupingBy(Book::getGenre,
                        Collectors.averagingDouble(Book::getRating)));

        Book oldestBook = books.stream()
                .min(Comparator.comparingInt(Book::getPublicationYear))
                .orElse(null);

        Book newestBook = books.stream()
                .max(Comparator.comparingInt(Book::getPublicationYear))
                .orElse(null);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("averageRatingByGenre", avgRatingByGenre);
        statistics.put("oldestBook", oldestBook);
        statistics.put("newestBook", newestBook);
        
        return statistics;
    }

}
