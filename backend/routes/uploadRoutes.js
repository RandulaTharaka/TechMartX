import path from "path"; // Importing the path module to handle and transform file paths.
import express from "express"; // Multer is a middleware for handling multipart/form-data, which is used for uploading files.
import multer from "multer";

const router = express.Router();

// # Sub Function 1
// The disk storage engine gives you full control on storing files to disk (server).
const storage = multer.diskStorage({
  // destination is used to determine within which folder the uploaded files should be stored.
  destination(req, file, cb) {
    cb(null, "uploads/"); // callback(cb) (needing to pass null as the first param)
  },
  // filename is used to determine what the file should be named inside the folder.
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// # Sub Function 2
// fileFilter is used to control which files are accepted by the server.
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/; // Regular expressions to match file extensions for images.
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/; // Regular expressions to match file extensions and MIME types for images.

  // Check if the file has a valid extension and MIME type.
  // filetypes is expected to be a regular expression object, and .test is a method provided by all regular expressions in JavaScript.
  // It returns a boolean value: true if the string matches the pattern, and false otherwise
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  // If both the extension and MIME type are valid, call the callback with null (indicating no error) and true (indicating the file is valid).
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

// upload is a middleware function that handles file uploads using the specified storage engine and file filter.
const upload = multer({ storage, fileFilter });
// 'image' is the name of the form field that contains the file to be uploaded.
const uploadSingleImage = upload.single("image");

// # Main Function
// This route handles the POST request to upload a single image file.
router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`, // image url send with res
    });
  });
});

export default router;
