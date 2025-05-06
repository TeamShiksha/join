const multer=require("multer");
const storage=multer.diskStorage({});

const fileFilter=(req,file,cb)=>{
    console.log("here in middle");
    console.log(file);
    cb(null,true);
}

exports.uploadImage=multer({storage, fileFilter});