const Catalog = require("../../models/catalog/catalogModel");

const getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.find({});
    return res.json(catalogs);
  } catch (err) {
    next(err);
  }
};

const createCatalog = async (req, res, next) => {
  try {
    const { catalog_name, catalog_color } = req.body;

    if (!(catalog_name && catalog_color)) {
      return res.status(400).send("All inputs are required");
    }

    const catalogExists = await Catalog.findOne({ catalog_name });
    if (catalogExists) {
      return res.status(400).send("Catalog already exists");
    }

    const catalog = await Catalog.create({
      catalog_name: catalog_name,
      catalog_color: catalog_color,
      interest: 0,
      created_date: new Date().toISOString(),
    });

    return res.json(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCatalogs, createCatalog };
