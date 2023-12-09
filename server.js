const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected To Database");
  })
  .catch(() => {
    console.log("Unable to connect with Database");
  });

// Define a schema for your data
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Create a model based on the schema
const Item = mongoose.model("Item", itemSchema);

// Middleware
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new item
app.post("/api/items", async (req, res) => {
  const { name, description } = req.body;

  try {
    const newItem = new Item({ name, description });
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
