const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

const apiUrl = process.env.API_URL;
const accessToken = process.env.ACCESS_TOKEN;
const cache = new NodeCache({ stdTTL: 600 });

const fetchFromApi = async (endpoint) => {
    try {
        const response = await axios.get(`${apiUrl}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API call error:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching data from API');
    }
};

const cacheKey = (category, company, n, page, minPrice, maxPrice, sort) => {
    return `category=${category}&company=${company}&n=${n}&page=${page}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
};

exports.fetchTopProducts = async (category, company, n, page = 1, sort = 'price', minPrice = 0, maxPrice = 10000) => {
    const key = cacheKey(category, company, n, page, minPrice, maxPrice, sort);

    if (cache.has(key)) {
        console.log('Cache hit');
        return cache.get(key);
    }

    console.log('Cache miss');
    const endpoint = `test/companies/${company}/categories/${category}/products?top=${n}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const products = await fetchFromApi(endpoint);

    const filteredProducts = products.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );

    const formattedProducts = filteredProducts.map(product => ({
        ...product,
        id: uuidv4()
    }));

    if (sort) {
        formattedProducts.sort((a, b) => {
            if (sort === 'rating') return b.rating - a.rating;
            if (sort === 'price') return a.price - b.price;
            if (sort === 'discount') return b.discount - a.discount;
            if (sort === 'company') return a.company.localeCompare(b.company);
            return 0;
        });
    }

    const start = (page - 1) * n;
    const paginatedProducts = formattedProducts.slice(start, start + n);

    cache.set(key, paginatedProducts);

    return paginatedProducts;
};

exports.fetchProductDetails = async (category, productId) => {
    const endpoint = `test/companies/${company}/categories/${category}/products?top=${n}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    const product = await fetchFromApi(endpoint);
    return product;
};
