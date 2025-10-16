import express from "express";
import dotenv from "dotenv";

import category_router from './src/routes/category.router.js';
import user_router from './src/routes/user.router.js';
import thesis_router from './src/routes/thesis.router.js';

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
app.use('/user', user_router);
app.use('/thesis', thesis_router);

function onStart() {
    console.log(`Server running on port ${port}`);
}

app.listen(port, onStart);

export default app;