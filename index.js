const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// In-memory data store to store JSON along with Id
const receipts = {};

// POST request to generate an ID and store the JSON object
app.post("/receipts/process", (req, res) => {
  const receiptData = req.body;
  const id = uuidv4();
  receipts[id] = receiptData;
  res.json({ id });
});

// GET request to retrieve the JSON data by ID and compute points
app.get("/receipts/:id/points", (req, res) => {
  const { id } = req.params;
  const receiptData = receipts[id];

  if (!receiptData) {
    return res.status(404).json({ error: "Receipt not found" });
  }

  const points = computePoints(receiptData);
  res.json({ points });
});

// function to compute points
function computePoints(receiptData) {
  var points = 0;

  // Rule 1: Points based on retailer name length
  let receiptlength = receiptData.retailer.length;
  points = receiptlength;

  // Rule 2: 50 points if total is a round dollar amount
  if (Number(receiptData.total) % 1 === 0) points = points + 50;

  // Rule 3: 25 points if total is a multiple of 0.25
  if (Number(receiptData.total) % 0.25 === 0) points = points + 25;

  // Rule 4: 5 points for every two items
  let totalitems = receiptData.items.length;
  points = points + Math.floor(totalitems / 2) * 5;

  // Rule 5: Points for items with descriptions of length multiple of 3
  receiptData.items.forEach((obj) => {
    let updatedprice = 0;
    if (obj.shortDescription.trim().length % 3 == 0) {
      updatedprice = Number(obj.price) * 0.2;
      points = points + Math.ceil(updatedprice);
    }
  });

  // Rule 6: 6 points if the day of the purchase date is odd
  const date = new Date(receiptData.purchaseDate);
  const day = date.getDate();
  if (day % 2 !== 0) points = points + 6;

  // Rule 7: 10 points if purchase time is between 2:00 PM and 4:00 PM
  const purchaseTime = receiptData.purchaseTime.split(":");
  const hour = Number(purchaseTime[0]);
  if (hour >= 14 && hour <= 16) points = points + 10;

  return points;
}

// Start the server

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
