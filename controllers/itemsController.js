const asyncHandler = require("express-async-handler");
const formidable = require("formidable");
const fs = require("fs");
// database schema or models
const itemsModel = require("../models/item-model");
// const cartModel = require("../models/cart-model");
// const orderModel = require("../models/order-model");

const addingPost = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (!err) {
      let ext = files.picture.originalFilename.split(".")[1].toLowerCase();
      if (ext === "png" || ext === "jpeg" || ext === "jpg" || ext === "mp4") {
        let newFilePath = "/foodposts/" + files.picture.newFilename + "." + ext;
        let newFilePathname =
          "http://localhost:8000/pics/" + files.picture.newFilename + "." + ext;

        fs.readFile(files.picture.filepath, (err, fileContent) => {
          if (!err) {
            fs.writeFile("./" + newFilePath, fileContent, async (err) => {
              if (!err) {
                fields["picture"] = [newFilePathname];
                // if(ext === "mp4")
                // {
                //     fields["fileType"]="video"
                // }

                const data = await itemsModel.create(fields);
                res.status(201).json(data, {
                  success: true,
                  message: "item created successfully",
                });
              }
            });
          }
        });
      } else {
        res.send({ message: "file not supported", success: false });
      }
    } else {
    }
  });
});

module.exports = {
  addingPost,
};
