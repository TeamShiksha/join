const express = require('express');
const cors = require('cors');
const { uploadImage } = require('./utils/multer');
const cloudinary=require('./utils/cloudinary');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const { db } = require("./utils/firebase");
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

const app = express();
const PORT = process.env.PORT || 5001;
const multer=require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); //increase the limit of uploading data using body-parser
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

  app.post("/api/getimageurl",async(req,res)=>{
    // console.log(req.body,"reqbody");
    // console.log(req.file)

    const file = req.body.imageData; 
    //  console.log(file,"here backend");
    
    try{
        const uploadResponse= await cloudinary.uploader.upload(`data:image/jpeg;base64,${file}`,{folder:"fileManagerFiles"});
        console.log(uploadResponse,"cloud");
        const fileUrl=uploadResponse.secure_url;
        const public_id=uploadResponse.public_id;

        // Store the image URL and other metadata in Firestore
       // Use modular syntax to add a document
       const collectionRef = collection(db, "imagesfolder"); // Get a reference to the collection
       const newDocumentData = {
           url: fileUrl,
           publicId: public_id,
           uploadedAt: new Date(),
       };
       const docRef = await addDoc(collectionRef, newDocumentData); // Add the document
       console.log("Document written with ID: ", docRef.id);

        res.status(200).json({"msg":"successfully got url",public_id,fileUrl});
        
    }
    catch(e){
        console.log("here error backend",e);
        res.status(400).json({"unknown error from backend":e.message});
    }
  
})

// Endpoint to get all image URLs from Firestore
app.get("/api/imageurls", async (req, res) => {
    try {
     
        const collectionRef = collection(db, "imagesfolder"); // Get the collection reference
        const snapshot = await getDocs(collectionRef); // Get all documents in the collection

        const imageUrls = [];
        snapshot.forEach(doc => {
            imageUrls.push({
                id: doc.id,          // Include the document ID
                url: doc.data().url,
                uploadedAt: doc.data().uploadedAt, // Include the timestamp
                publicId: doc.data().publicId
            });
        });
        res.status(200).json(imageUrls);
    } catch (e) {
        console.error("Error getting image URLs from Firestore:", e);
        res.status(500).json({ error: "Failed to retrieve image URLs" });
    }
});



app.get('/',(req,res)=>{
    res.json({"message":"hello"})
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
