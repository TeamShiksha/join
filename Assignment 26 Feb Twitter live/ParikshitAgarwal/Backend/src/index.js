import express, {
    query
} from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import fs from 'fs/promises'

const filePath = new URL('../assets/books.json',
    import.meta.url);
const app = express();
app.use(cors())

app.get("/books", async (req, res) => {
    const {
        genre
    } = req.query
    try {
        const jsonData = await fs.readFile(filePath, 'utf8'); // Adjust the path
        const data = JSON.parse(jsonData);
        let filteredData = [...data];
        if (genre) {
            filteredData = data.filter((item) => {
                console.log(item)
                console.log(item.genre === genre)
                return item.genre === genre
            })
        }
        res.status(200).json(filteredData)
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).json({
            message: "Error Fetching books please try again later"
        })

    }
})


app.get("/book/:id", async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const jsonData = await fs.readFile(filePath, 'utf8'); // Adjust the path
        const data = JSON.parse(jsonData);

        const book = data.find((item) => item.id === id);
        if (book) {
            res.status(200).json(book)
        } else {
            res.status(200).json({
                message: "No book found for the given id"
            })
        }



    } catch (error) {
        console.error('Error reading JSON file:', err);
        res.status(500).json({
            message: "Error Fetching book please try again later"
        })

    }

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});