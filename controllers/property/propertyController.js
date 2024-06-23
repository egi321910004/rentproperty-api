const Property = require("../../models/property/propertyModel");
const recordsPerPage = require("../../config/pagination");

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
    res.json({ message: "product removed" });
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

module.exports = {
  getPropertyById,
  getPropertys,
  adminGetPropertys,
  adminDeleteProperty,
  adminCreateProperty,
};
