const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    let filename = file.originalname.replace(/[^\w\s-]/gi, ''); 
    filename = filename.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;