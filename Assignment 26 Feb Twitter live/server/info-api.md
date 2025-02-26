# Book Statistics API

## Endpoints

**1.URL:** `http://localhost:5000/api/` **For fetch all data**
#### Extra query parameter genre `http://localhost:5000/api/?genre=classic`

**Method:** `GET`

## Response Format

```json
{
    "success": true,
    "message": "String",
    "data": []
}
```
**2.URL:** `http://localhost:5000/api/fetch/1`  **For fetch  data of id**

**Method:** `GET`

## Response Format

```json
{
    "success":"Boolean",
    "message": "String",
    "data":{}
}
```
**3.URL:** `http://localhost:5000/api/`  **For update the  data**

**Method:** `POST`

## Payload 
```json
{
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "publicationYear": 1932,
    "genre": "Science Fiction",
    "rating": 4.3,
    "description": "A dystopian novel set in a future where human beings are manufactured and conditioned.",
    "metadata": {
      "pages": 268,
      "stockLeft": 50,
      "price": 16.99,
      "discount": 20,
      "edition": 2
    }
}
```
## Response Format

```json
{
    "success":"Boolean",
    "message": "String",
    "data":{}
}
```

**4.URL:** `http://localhost:5000/api/statistics`  **For fetch statistics**

**Method:** `GET`

## Response Format

```json
{
    "success":"Boolean",
    "message": "String",
    "data":[]
}
```
**5.URL:** `http://localhost:5000/api/update-rating/:id`  **For update the rating of a particular rating**

**Method:** `PUT`

## Payload

```json
{
    "rating":5
}
```
## Response Format

```json
{
    "success":"Boolean",
    "message": "String",
    "data":[]
}
```

## Description

This API provides statistics about books, including total count, total rating, and average rating for each genre.

give in text format

