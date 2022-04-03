const express = require("express");
const path = require("path");
const multer = require("multer");
const upload = multer();
const config = require("./config");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use("/images", express.static(path.join(__dirname, "./public/images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.body) {
        return res.status(500).json({ error: "Internal server error" });
    }
    if (!req.body.login || !req.body.password) {
        return res
            .status(400)
            .json({ error: "Login or password field is empty" });
    }
    const { login, password } = req.body;
    console.log("password :>> ", password);
    console.log("config.password :>> ", config.password);
    if (login !== config.login || password !== config.password) {
        return res.status(403).json({ message: "Wrong login or password" });
    }
    console.log("req.file :>> ", req.file);
    const dir = path.join(
        __dirname,
        `./public/images/${req.file.originalname}`
    );
    console.log("dir :>> ", dir);
    fs.writeFileSync(dir, req.file.buffer);
    res.status(200).json({ message: "File successfully uploaded" });
});

app.use((req, res) => {
    res.status(404).json({ error: "Enpoint not found" });
});

app.listen(80, () => {
    console.log("Server is listening on PORT: 80");
});
