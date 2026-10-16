import express from "express";
import connectionDB from "./DB/models/connectionDB.js";
import userRouter from './modules/users/user.controller.js';
const app = express();
const port = 3000;





 
const bootstrap = async () => {


    app.use(express.json());

    await connectionDB()
    app.get('/',
        (req, res) => {
            res.status(200).json({ message: "welcome" })
        }
    )
    app.use("/users",userRouter)
    app.use("{/*demo}", (req, res, next) => {
        res.status(404).json({
            message: `Url : ${req.originalUrl} With method ${req.method} not found`
            , statusCode: 404
        })
    })

    app.listen(port, () => {
        console.log(`server is running on port ${port}`);

    })

}

export default bootstrap