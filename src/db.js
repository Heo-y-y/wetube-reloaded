import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handelError = () => console.log("❌ DB Error", error);

db.on("error", handelError);
db.once("open", handleOpen);
