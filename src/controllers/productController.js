const productService = require('../services/productService');

exports.getTopProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const { n, page = 1, sort = 'price', minPrice = 0, maxPrice = 10000, company } = req.query;

    const pageNumber = parseInt(page, 10);
    const numberOfProducts = parseInt(n, 10);
    const minPriceNumber = parseFloat(minPrice);
    const maxPriceNumber = parseFloat(maxPrice);

    if (isNaN(pageNumber) || isNaN(numberOfProducts) || isNaN(minPriceNumber) || isNaN(maxPriceNumber)) {
      return res.status(400).json({ error: 'Invalid pagination or product count parameters' });
    }

    const products = await productService.fetchTopProducts(
      category,
      company,
      numberOfProducts,
      pageNumber,
      sort,
      minPriceNumber,
      maxPriceNumber
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { category, productId } = req.params;
    const product = await productService.fetchProductDetails(category, productId);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
