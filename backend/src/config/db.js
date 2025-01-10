import mongoose from "mongoose";

async function connect(params) {
    try {
        await mongoose.connect('mongodb://localhost:27017/webdongphuchoatoc');
        console.log("connect sucessfully");

    } catch (error) {
        console.log("error connect to database");
    }
}
export {connect}
