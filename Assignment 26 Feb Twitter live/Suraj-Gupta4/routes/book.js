const express = require('express')
const fs = require('fs');

const router = express.Router()

const jsonBookData = require('../books.json');



// All Book 
router.get("/allbooks", (req, res)=>{
    const allBookdata= jsonBookData;

    res.json({msg:"All books",
        allBookdata
    })
})


// Get book by ID
router.get('/:bookId', (req,res)=>{
    const bookId = req.params.bookId
   
    const book = jsonBookData.find(item => item.id === bookId);
    
    if (book) {
        return res.json({ msg: "Book by ID", book });
    }
    res.json({msg:"Error while finding book"});
   
})



// Add book to collection
router.post("/addbook", async(req,res)=>{
    const bookData = req.body
     const filepath = '../books.json'

    if (jsonBookData.length === 0) {
        bookData.id = "1"; 
    } else {
        
        const lastId = parseInt(jsonBookData[jsonBookData.length - 1].id);
        bookData.id = (lastId + 1).toString();
    }
    
    jsonBookData.push(bookData);
    
    fs.writeFile(filepath, JSON.stringify(jsonBookData,2),(err)=>{
        console.log(err);
    });
    
    res.status(200).json({
        msg:"Book added successfully",
        jsonBookData
    })
})


// Update Ratings
router.post('/updateRatings', (req,res)=>{
    const {bookId, newRating} = req.body;
   

     const book = jsonBookData.find(item => item.id=== bookId)
     if(book.rating!= newRating){
        book.rating=newRating;

        return res.json({
            msg:"Rating Updated",
            NewRating:book.rating
        })
     }
    
     res.json({
        msg:"Error in updaing the rating"
     })

})


// Get statistics

router.post('/genreStatistics', (req,res)=>{
    const genre = req.body.genre;
    
    var count=0;
    var ratingSum=0;
    for(let i=0;i<jsonBookData.length;i++){
        if(jsonBookData[i].genre===genre){
              ratingSum+=jsonBookData[i].rating;
              count+=1;
        }
    }
   
    
    const avgRating= Math.round((ratingSum/count)*100)/100;

    res.json({
        msg:"Average Rating for genre",
        avgRating
    })
})

module.exports=router
