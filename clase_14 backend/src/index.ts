import express from "express"
import { Schema, model } from "mongoose"
import { connectMongoDB } from "./config/mongo"
import cors from "cors"


process.loadEnvFile()

const PORT = process.env.PORT


const booksSchema = new Schema({
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    year: {type: Number, required: true}
})

const Book = model("Book", booksSchema)

const app = express()
app.use(express.json())

app.use(cors())

const getAllBooks = async () => {
    try {
        const books = await Book.find()
        return ({
            success: true,
            data: books,
            message: "Obteniendo todos los libros"
        })
    } catch (error) {
        const err = error as Error
        return ({
            success: false,
            message: err.message
        })
    }
}

// http://localhost:1235/api/book
app.get("/api/books", async (request, response): Promise<any> => {
    try {
        const books = await Book.find()
        return response.json ({
            success: true,
            data: books,
            message: "Obteniendo todos los libros"
        })
    } catch (error) {
        const err = error as Error
        return response.json ({
            success: false,
            message: err.message
        })
    }
})

app.post("/api/books", async (req, res): Promise<any> => {
    try {
        const body = req.body 
        const {title, author, year} = body
        if (!title || !author || !year) return res.status(400).json({success: false, message: "data invalida"})
        const newBook = new Book ({title, author, year})
        const savedBook = await newBook.save()
        res.status(201).json({success: true, data: savedBook, message: "Libro agregado con éxito ✅"})
    } catch (error) {
        const err = error as Error
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

app.delete("/api/books/:id", async (req, res): Promise<any> => {
    try {
    const { id } = req.params;

    const deleted = await Book.findByIdAndDelete(id);

    if (!deleted) {
        return res.status(404).json({ success: false, message: "Libro no encontrado ❌" });
    }

    return res.json({ success: true, data: deleted, message: "Libro borrado con éxito ✅" });
    } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
    }
});

app.patch("/api/books/:id", async (req, res): Promise<any> => {
    try {
    const { id } = req.params;
    const { title, author, year } = req.body;

    const updated = await Book.findByIdAndUpdate(
        id,
        { title, author, year },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ success: false, message: "Libro no encontrado ❌" });
    }

    return res.json({ success: true, data: updated, message: "Libro actualizado ✅" });
    } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
    }
});



app.listen(PORT, () => {
    console.log(`✅ Servidor en escucha en el puerto http://localhost: ${PORT}`)

    connectMongoDB()
})
