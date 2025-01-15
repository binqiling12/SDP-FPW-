const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Enhanced CORS configuration for Vite React
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdp_project'
};

async function queryDatabase(query, params) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.execute(query, params);
        return results;
    } finally {
        connection.end();
    }
}

// Role endpoint
app.post('/api/roles', async (req, res) => {
    const { role_name } = req.body;
    if (!role_name) {
        return res.status(400).json({ error: 'Role name is required' });
    }
    try {
        const result = await queryDatabase('INSERT INTO Role (role_name) VALUES (?)', [role_name]);
        res.status(201).json({ id: result.insertId, message: 'Role created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User endpoint
app.post('/api/users', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRoleId = 2;

        const result = await queryDatabase(
            'INSERT INTO User (username, password, email, role_id) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, userRoleId]
        );

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                id: result.insertId,
                username,
                email,
                role_id: userRoleId
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create user',
            error: err.message
        });
    }
});

// GET endpoint for users
app.get('/api/users', async (req, res) => {
    try {
        const results = await queryDatabase(`
            SELECT 
                User.user_id, 
                User.username, 
                User.email, 
                User.role_id, 
                Role.role_name 
            FROM User 
            LEFT JOIN Role ON User.role_id = Role.role_id
        `);

        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch users',
            error: err.message
        });
    }
});

// GET endpoint for a single user by username
app.get('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const results = await queryDatabase(`
            SELECT 
                User.user_id, 
                User.username, 
                User.password, 
                User.email, 
                User.role_id, 
                Role.role_name 
            FROM User 
            LEFT JOIN Role ON User.role_id = Role.role_id
            WHERE User.username = ?
        `, [username]);

        if (results.length > 0) {
            res.status(200).json({
                status: 'success',
                data: results[0]
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user',
            error: err.message
        });
    }
});

// Category endpoint
app.post('/api/categories', async (req, res) => {
    const { category_name } = req.body;
    if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    try {
        const result = await queryDatabase('INSERT INTO Category (category_name) VALUES (?)', [category_name]);
        res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint for categories
app.get('/api/categories', async (req, res) => {
    try {
        const results = await queryDatabase('SELECT * FROM Category', []);
        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch categories',
            error: err.message
        });
    }
});

// Product endpoint
app.post('/api/products', async (req, res) => {
    const { name, stock, price, image, description, category_id } = req.body;

    if (!name || !price || stock === undefined || !category_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        });
    }

    // Validate category_id
    const validCategories = [1, 2, 3];
    if (!validCategories.includes(category_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid category ID'
        });
    }

    try {
        const result = await queryDatabase(
            'INSERT INTO Product (name, stock, price, image, description, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, stock, price, image, description, category_id]
        );
        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: {
                id: result.insertId,
                name,
                stock,
                price,
                image,
                description,
                category_id
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create product',
            error: err.message
        });
    }
});

// GET endpoint for products
app.get('/api/products', async (req, res) => {
    try {
        const results = await queryDatabase('SELECT * FROM Product', []);
        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch products',
            error: err.message
        });
    }
});

// DELETE endpoint for products
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await queryDatabase('DELETE FROM Product WHERE product_id = ?', [productId]);
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete product',
            error: err.message
        });
    }
});

// PUT endpoint for products
app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, stock, price, image, description, category_id } = req.body;

    // Validate category_id
    const validCategories = [1, 2, 3];
    if (!validCategories.includes(category_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid category ID'
        });
    }

    try {
        await queryDatabase(
            'UPDATE Product SET name = ?, stock = ?, price = ?, image = ?, description = ?, category_id = ? WHERE product_id = ?',
            [name, stock, price, image, description, category_id, productId]
        );
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product_id: productId,
                name,
                stock,
                price,
                image,
                description,
                category_id
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update product',
            error: err.message
        });
    }
});

// ProductCategory endpoint
app.post('/api/product-categories', async (req, res) => {
    const { product_id, category_id } = req.body;

    if (!product_id || !category_id) {
        return res.status(400).json({ error: 'Product ID and Category ID are required' });
    }

    try {
        await queryDatabase('INSERT INTO ProductCategory (product_id, category_id) VALUES (?, ?)', [product_id, category_id]);
        res.status(201).json({ message: 'Product category mapping created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cart endpoint
app.post('/api/carts', async (req, res) => {
    const { user_id, total_price } = req.body;

    if (!user_id || !total_price) {
        return res.status(400).json({ error: 'User ID and total price are required' });
    }

    try {
        const result = await queryDatabase('INSERT INTO Cart (user_id, total_price) VALUES (?, ?)', [user_id, total_price]);
        res.status(201).json({ id: result.insertId, message: 'Cart created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint for cart items by user ID
app.get('/api/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const results = await queryDatabase(`
            SELECT 
                CartItem.cart_item_id,
                CartItem.quantity,
                Product.product_id,
                Product.name,
                Product.price,
                Product.image,
                Product.description
            FROM CartItem
            JOIN Cart ON CartItem.cart_id = Cart.cart_id
            JOIN Product ON CartItem.product_id = Product.product_id
            WHERE Cart.user_id = ?
        `, [userId]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch cart items',
            error: err.message
        });
    }
});

// CartItem endpoint
app.post('/api/cart-items', async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || quantity === undefined) {
        return res.status(400).json({ error: 'Cart ID, Product ID, and quantity are required' });
    }

    try {
        const result = await queryDatabase(
            'INSERT INTO CartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)',
            [cart_id, product_id, quantity]
        );
        res.status(201).json({ id: result.insertId, message: 'Cart item created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Transaction endpoint
app.post('/api/transactions', async (req, res) => {
    const { user_id, status, total_amount } = req.body;

    if (!user_id || !status || total_amount === undefined) {
        return res.status(400).json({ error: 'User ID, status, and total amount are required' });
    }

    try {
        const result = await queryDatabase(
            'INSERT INTO Transaction (user_id, status, total_amount) VALUES (?, ?, ?)',
            [user_id, status, total_amount]
        );
        res.status(201).json({ id: result.insertId, message: 'Transaction created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TransactionItem endpoint
app.post('/api/transaction-items', async (req, res) => {
    const { transaction_id, product_id, quantity, price_at_purchase } = req.body;

    if (!transaction_id || !product_id || quantity === undefined || price_at_purchase === undefined) {
        return res.status(400).json({ error: 'Transaction ID, Product ID, quantity, and price at purchase are required' });
    }

    try {
        const result = await queryDatabase(
            'INSERT INTO TransactionItem (transaction_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
            [transaction_id, product_id, quantity, price_at_purchase]
        );
        res.status(201).json({ id: result.insertId, message: 'Transaction item created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: err.message
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Vite React app should be running on http://localhost:5173`);
});
