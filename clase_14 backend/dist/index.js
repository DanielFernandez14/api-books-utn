"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const mongo_1 = require("./config/mongo");
const cors_1 = __importDefault(require("cors"));
process.loadEnvFile();
const PORT = process.env.PORT;
const booksSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    year: { type: Number, required: true }
});
const Book = (0, mongoose_1.model)("Book", booksSchema);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const getAllBooks = async () => {
    try {
        const books = await Book.find();
        return ({
            success: true,
            data: books,
            message: "Obteniendo todos los libros"
        });
    }
    catch (error) {
        const err = error;
        return ({
            success: false,
            message: err.message
        });
    }
};
// http://localhost:1235/api/book
app.get("/api/books", async (request, response) => {
    try {
        const books = await Book.find();
        return response.json({
            success: true,
            data: books,
            message: "Obteniendo todos los libros"
        });
    }
    catch (error) {
        const err = error;
        return response.json({
            success: false,
            message: err.message
        });
    }
});
app.post("/api/books", async (req, res) => {
    try {
        const body = req.body;
        const { title, author, year } = body;
        if (!title || !author || !year)
            return res.status(400).json({ success: false, message: "data invalida" });
        const newBook = new Book({ title, author, year });
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, data: savedBook, message: "Libro agregado con éxito ✅" });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
app.delete("/api/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Libro no encontrado ❌" });
        }
        return res.json({ success: true, data: deleted, message: "Libro borrado con éxito ✅" });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ success: false, message: err.message });
    }
});
app.patch("/api/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, year } = req.body;
        const updated = await Book.findByIdAndUpdate(id, { title, author, year }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Libro no encontrado ❌" });
        }
        return res.json({ success: true, data: updated, message: "Libro actualizado ✅" });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ success: false, message: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`✅ Servidor en escucha en el puerto http://localhost: ${PORT}`);
    (0, mongo_1.connectMongoDB)();
});
//# sourceMappingURL=index.js.map