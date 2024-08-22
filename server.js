const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('DB connected!');
})
.catch((err) => {
    console.error('DB connection error:', err);
});

// Creating the schema
const eshopSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
});

// Creating model
const Eshop = mongoose.model('Eshop', eshopSchema);

// Create new Eshop items
app.post('/eshop', async (req, res) => {
    const items = req.body; // Assuming the request body is an array of objects
    try {
        // Validate if input is an array
        if (!Array.isArray(items)) {
            return res.status(400).json({ message: 'Request body must be an array of objects' });
        }

        // Map through the array and create new Eshop documents
        const newEshops = items.map(item => new Eshop(item));
        
        // Save all Eshop documents
        const savedEshops = await Eshop.insertMany(newEshops);
        
        res.status(201).json(savedEshops);
    } catch (error) {
        console.error('Error creating eshops:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all items
app.get('/eshop', async (req, res) => {
    try {
        const eshops = await Eshop.find();
        res.json(eshops); // Return the list of Eshops
    } catch (error) {
        console.error('Error fetching eshops:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete an Eshop item by ID
app.delete('/eshop/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Eshop.findByIdAndDelete(id);
        if (result) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ message: 'Eshop not found' });
        }
    } catch (error) {
        console.error('Error deleting eshop:', error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const port = 3003;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
