const express = require("express");
const formidable = require("formidable");
const fs = require("fs");

// middleware function
const verifytoken = require("../verifytoken");

// database schema or models
const itemsModel = require("../models/item-model");
const cartModel = require("../models/cart-model");
const orderModel = require("../models/order-model");

//for routing setup
const router = express.Router();

router.post("/create", verifytoken, async (req, res) => {
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
            fs.writeFile("./" + newFilePath, fileContent, (err) => {
              if (!err) {
                fields["picture"] = [newFilePathname];
                // if(ext === "mp4")
                // {
                //     fields["fileType"]="video"
                // }

                itemsModel
                  .create(fields)
                  .then((data) => {
                    res.send({
                      message: "item Created successfully",
                      success: true,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send({
                      message: "item was not created",
                      success: false,
                    });
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

router.get("/getitems/:adminid", verifytoken, async (req, res) => {
  let id = req.params.adminid;

  // itemsModel
  //   .find({ restaurant: id })
  //   .populate("restaurant")
  //   .then((items) => {
  //     res.send({ success: true, items });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send({ message: "some issue while fetching items" });
  //   });

  try {
    let items = await itemsModel
      .find({ restaurant: id })
      .populate("restaurant");
    console.log(items);
  } catch (error) {
    console.log(error);
  }
});

// to update restaurant items

router.put("/update/:id", verifytoken, (req, res) => {
  let adminid = req.params.id;
  console.log(adminid);

  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (Object.keys(files).length !== 0) {
      let fileData = fs.readFileSync(files.picture.filepath);
      let ext = files.picture.originalFilename.split(".")[1].toLowerCase();

      if (ext === "jpg" || ext === "png" || ext === "jpeg") {
        let uploadPath = "./foodposts/" + files.picture.newFilename + "." + ext;
        let publicPath =
          "http://localhost:8000/pics/" + files.picture.newFilename + "." + ext;
        fields.picture = publicPath;
        fs.writeFileSync(uploadPath, fileData);
      }
    }

    if (Object.keys(fields).length !== 0) {
      itemsModel
        .findByIdAndUpdate(adminid, fields)
        .then(async (data) => {
          let user = await itemsModel.findById(adminid);
          res.send({ success: true, message: " updated successfully", user });
        })
        .catch((err) => {
          res.send({ message: "Someproblem while updating the item" });
        });
    }
  });
});

router.delete("/deleteitem/:id", verifytoken, (req, res) => {
  let id = req.params.id;
  itemsModel
    .deleteOne({ _id: id })
    .then((info) => {
      res.send({
        success: true,
        message: "Comment Deleted successfully",
        info,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some issue while deleting the post" });
    });
});

router.get("/allitems", verifytoken, (req, res) => {
  itemsModel
    .find()
    .populate("restaurant")
    .then((items) => {
      res.send({ success: true, items });
    })
    .catch((err) => {
      res.send({ message: "some problem..." });
    });
});

router.post("/addtocart/:id", (req, res) => {
  let id = req.params.id;

  cartModel.findOne({ user: id }).exec((err, cart) => {
    if (err) {
      res.send({ message: "already in cart" });
    }

    if (cart) {
      // if cart is already exists update the product inside that object

      const item = req.body.cartItems.item;
      const product = cart.cartItems.find((c) => c.item == item);
      // console.log(item);

      if (product) {
        cartModel
          .findOneAndUpdate(
            { user: id, "cartItems.item": item },
            {
              $set: {
                "cartItems.$": {
                  ...req.body.cartItems,
                  quantity: product.quantity + req.body.cartItems.quantity,
                  price:
                    req.body.cartItems.price +
                    product.quantity * req.body.cartItems.price,
                },
              },
            }
          )
          .exec((err, cart) => {
            if (err) {
              res.send({ message: "already in cart" });
            }
            if (cart) {
              res.send({ message: "quantity updated", cart });
            }
          });
      }

      // if cart is already exists then new product will be added inside the cart object
      else {
        cartModel
          .findOneAndUpdate(
            { user: id },
            {
              $push: {
                cartItems: req.body.cartItems,
              },
            }
          )
          .exec((err, cart) => {
            if (err) {
              res.send({ message: "already in cart" });
            }
            if (cart) {
              res.send({ message: "another one in cart", cart });
            }
          });
      }
    } else {
      // if user is new to cart then new cart object will be added

      const cart = new cartModel({
        user: id,
        cartItems: [req.body.cartItems],
      });

      cart.save((err, cart) => {
        if (err) return res.send({ message: "item not updated" });

        if (cart) return res.send({ message: "successfull", cart });
      });
    }
  });
});

// end point to all items inside a cart for particular user
router.get("/allcartitems/:id", verifytoken, async (req, res) => {
  let id = req.params.id;

  let items = await cartModel
    .aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(id) },
      },
      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "items",
          localField: "cartItems.item",
          foreignField: "_id",
          as: "itemdetails",
        },
      },
      {
        $unwind: "$itemdetails",
      },
      {
        $lookup: {
          from: "restaurantdetails",
          localField: "cartItems.restaurant",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: "$restaurant",
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ])

    .exec((err, data) => {
      if (err) {
        res.send({ message: "no data found" });
      }

      if (data) {
        res.send({ success: true, data, items });
      }
    });
});

// end point to remove particular item inside a cart for particular user

router.delete("/cart/deleteitem/:id/:item", verifytoken, (req, res) => {
  let userId = req.params.id;
  let itemId = req.params.item;

  cartModel
    .findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          cartItems: {
            item: itemId,
          },
        },
      }
    )

    .exec((err, data) => {
      if (err) {
        res.send({ success: false, message: "no data found" });
      }

      if (data) {
        res.send({ success: true, data, message: "successfully removed" });
      }
    });
});

// end point to decrement the protect quantity
router.post("/decreasequantity/:id", (req, res) => {
  let id = req.params.id;
  cartModel.findOne({ user: id }).exec((err, cart) => {
    if (err) {
      res.send({ message: "already in cart" });
    }

    if (cart) {
      // finding the correct product inside particular userCart

      const item = req.body.cartItems.item;
      const product = cart.cartItems.find((c) => c.item == item);

      if (product) {
        cartModel
          .findOneAndUpdate(
            { user: id, "cartItems.item": item },
            {
              $set: {
                "cartItems.$": {
                  ...req.body.cartItems,
                  quantity: product.quantity - req.body.cartItems.quantity,
                  price:
                    req.body.cartItems.price * product.quantity -
                    req.body.cartItems.price,
                },
              },
            }
          )
          .exec((err, cart) => {
            if (err) {
              res.send({ message: "already in cart" });
            }
            if (cart) {
              res.send({ message: "quantity decreased", cart });
            }
          });
      }
    }
  });
});

// end point to create order for particular user

router.post("/orderdetails", async (req, res) => {
  let body = req.body;

  // orderModel
  //   .insertMany(body)
  //   .then((data) => {
  //     res.send({ message: "inserted data", data, success: true });
  //   })
  //   .catch((err) => {
  //     res.send({ message: "unable to upload" });
  //   });

  try {
    let orderDetails = await orderModel.insertMany(body);
    res.send({ message: "inserted data", success: true, orderDetails });
  } catch (error) {
    res.send({ message: "unable to upload" });
  }
});

// end point to fetch order details for particular user

router.get("/allOrdersDetails/:id", async (req, res) => {
  let id = req.params.id;

  await orderModel
    .aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemsdetails",
        },
      },
      {
        $unwind: "$itemsdetails",
      },
    ])
    .exec((err, data) => {
      if (err) {
        res.send(err);
      }
      if (data) {
        res.send({ success: true, message: "fetched data successfully", data });
      }
    });
});

module.exports = router;
