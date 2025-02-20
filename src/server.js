const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const pokemonRouter = require("../routes/pokemon");
dotenv.config();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public"))); 
app.use("/", pokemonRouter);
const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
 
