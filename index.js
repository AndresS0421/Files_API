import express from "express";
import dotenv from "dotenv";

import category_router from './src/routes/category.router.js';
import files_router from './src/routes/files.router.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/category', category_router);
app.use('/files', files_router);

function onStart() {
    console.log(`Server running on port ${port}`);
}

app.listen(port, onStart);

export default app;