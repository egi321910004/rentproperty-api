const Property = require("../../models/property/propertyModel");
const recordsPerPage = require("../../config/pagination");
const imageValidate = require("../../utils/imageValidate");

const getPropertys = async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNum) || 1;
    const totalPropertys = await Property.countDocuments({});

    let sort = {};
    const sortOption = req.query.sort || "";
    if (sortOption) {
      let sortOpt = sortOption.split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    const Propertys = await Property.find({})
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);

    res.json({
      Propertys,
      pageNum,
      paginationLinksNumber: Math.ceil(totalPropertys / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

const getPropertyById = async (req, res, next) => {
  try {
    const Propertys = await Property.findById(req.params.id)
      .populate("reviews")
      .orFail();
    res.json(Propertys);
  } catch (err) {
    next(err);
  }
};

const adminGetPropertys = async (req, res, next) => {
  try {
    const Propertys = await Property.find({});
    //   .sort({ category: 1 })
    //   .select("name price category");
    return res.json(Propertys);
  } catch (err) {
    next(err);
  }
};

const adminDeleteProperty = async (req, res, next) => {
  try {
    const Propertys = await Property.findById(req.params.id).orFail();
    await Propertys.remove();
    res.json({ message: "Propertys removed" });
  } catch (err) {
    next(err);
  }
};

const adminCreateProperty = async (req, res, next) => {
  try {
    const {
      property_name,
      property_description,
      property_price,
      property_bedroom,
      property_bathroom,
      property_car,
      id_catalogue,
      property_address,
      property_sales,
    } = req.body;

    if (
      !(
        property_name &&
        property_description &&
        property_price &&
        property_bedroom &&
        property_bathroom &&
        property_car &&
        id_catalogue &&
        property_address &&
        property_sales
      )
    ) {
      return res.status(400).send("All inputs are required");
    }

    const propertyExists = await Property.findOne({ property_name });
    if (propertyExists) {
      return res.status(400).send("Property already exists");
    }
    const property = new Property({
      property_name: property_name,
      id_catalogue: id_catalogue,
      property_description: property_description,
      property_address: property_address,
      property_price: property_price,
      property_sales: property_sales,
      property_bedroom: property_bedroom,
      property_bathroom: property_bathroom,
      property_car: property_car,
      created_date: new Date().toISOString(),
    });
    await property.save();

    res.json({
      message: "property created",
      propertyId: property._id,
    });
  } catch (err) {
    next(err);
  }
};

const adminUpload = async (req, res, next) => {
  try {
    if (!req.files || !!req.files.images === false) {
      return res.status(400).send("No files were uploaded.");
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }

    const path = require("path");
    const { v4: uuidv4 } = require("uuid");
    const uploadDirectory = path.resolve(
      __dirname,
      "../../public",
      "images",
      "property"
    );

    let property = await Property.findById(req.query.propertyId).orFail();

    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {
      var fileName = uuidv4() + path.extname(image.name);
      var uploadPath = uploadDirectory + "/" + fileName;
      property.images.push({ path: "/images/property/" + fileName });
      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    await property.save();
    return res.send("Files uploaded!");
  } catch (err) {
    next(err);
  }
};

const adminDeletePropertyImage = async (req, res, next) => {
  try {
    const imagePath = decodeURIComponent(req.params.imagePath);
    const path = require("path");
    const finalPath = path.resolve("../../public") + imagePath;

    const fs = require("fs");
    fs.unlink(finalPath, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
    await Property.findOneAndUpdate(
      { _id: req.params.propertyId },
      { $pull: { images: { path: imagePath } } }
    ).orFail();
    return res.end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPropertyById,
  getPropertys,
  adminGetPropertys,
  adminDeleteProperty,
  adminCreateProperty,
  adminUpload,
  adminDeletePropertyImage,
};
