require('dotenv').config()
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
// Database URL
const dbURL = process.env.DBURL || 'mongodb://localhost:27017';
// MongoDB Client
const mc = new MongoClient(dbURL);
// console.log(process.env.DBURL)
app.use(express.json())

// Connection to MongoDB
mc.connect().then(client => {
    console.log('Connected to MongoDB');
    // Connect to farmersdb Database
    const farmersDataBase = client.db('farmersdb');
    // Connect to cropListingCollection Collection
    const cropListingCollection = farmersDataBase.collection('croplisting');

    // Share the cropListingCollection Collection with the APIs
    app.set('cropListingCollection', cropListingCollection);

    // getListings: GET Endpoint - For getting all the Products that are listed by the Farmer
    app.get('/getListings', async (req, res) => {
        try {
            // Query the collection to get All the crops from the collection
            await cropListingCollection.find().toArray().then((crops) => {
                res.send({
                    cropListings: crops
                });
            });

        } catch (err) {
            res.status(500).send({
                message: 'An error occurred',
                error: err.message
            });
        }

    })

    // getListing: GET Endpoint - For getting a specific Product that is listed by the Farmer
    app.get('/getListing/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let cropList = await cropListingCollection.findOne({ id: ID });
            if (!cropList) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            res.send({
                crop: cropList
            });

        } catch (err) {
            res.status(500).send({
                message: 'An error occurred',
                error: err.message
            });
        }

    });

    // getListofFarmer/:farmerID: GET Endpoint - For getting all the Products that are listed by a specific Farmer
    app.get('/getListofFarmer/:farmerID', async (req, res) => {
        try {
            let farmerID = String(req.params.farmerID);
            let cropList = await cropListingCollection.find({ FarmerId: farmerID }).toArray();
            if (!cropList) {
                res.status(404).send({
                    message: 'Farmer not found'
                });
                return;
            }
            res.send({
                cropListings: cropList
            });

        } catch (err) {
            res.status(500).send({
                message: 'An error occurred',
                error: err.message
            });
        }
    });

    // getWholesaleListings: GET Endpoint - For getting all the Wholesale Products that are listed by the Farmer
    app.get('/getWholesaleListings', async (req, res) => {
        try {
            // Query the collection to get All the crops from the collection
            await cropListingCollection.find({ TypeOfListing: "Wholesale" }).toArray().then((crops) => {
                res.send({
                    cropListings: crops
                });
            });
        } catch (err) {
            res.status(500).send({
                message: 'An error occurred',
                error: err.message
            });
        }

    });

    // getRetailListings: GET Endpoint - For getting all the Retail Products that are listed by the Farmer
    app.get('/getRetailListings', async (req, res) => {
        try {
            // Query the collection to get All the crops from the collection
            await cropListingCollection.find({ TypeOfListing: "Retail" }).toArray().then((crops) => {
                res.send({
                    cropListings: crops
                });
            });
        } catch (err) {
            res.status(500).send({
                message: 'An error occurred',
                error: err.message
            });
        }

    });

    // putListing : PUT Endpoint - For adding a new Product to the list
    app.put('/putListing', async (req, res) => {
        try {
            let crop = req.body.crop;

            // Check if the crop already exists in the collection
            let existingCrop = await cropListingCollection.findOne(crop);
            if (existingCrop) {
                // Crop already exists, send a response indicating duplication
                res.status(400).send({
                    message: 'Crop already exists in the listing',
                    payload: existingCrop
                });
            }
            else {
                // Crop doesn't exist add it to the listing
                await cropListingCollection.insertOne(crop);
                res.send({
                    message: 'Crop added successfully',
                    payload: crop
                });
            }
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    // updateQuantity : UPDATE Endpoint - For updating the quantity of a Product in the list
    app.put('/updateQuantity/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let crop = await cropListingCollection.findOne({ id: ID });
            if (!crop) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            let newQuantity = req.body.quantity;
            await cropListingCollection.updateOne({ id: ID }, { $set: { Quantity: newQuantity } });
            res.send({
                message: 'Quantity updated successfully',
                payload: crop
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    // updatePrice : UPDATE Endpoint - For updating the price of a Product in the list
    app.put('/updatePrice/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let crop = await cropListingCollection.findOne({ id: ID });
            if (!crop) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            let newPrice = req.body.price;
            await cropListingCollection.updateOne({ id: ID }, { $set: { Price: newPrice } });
            res.send({
                message: 'Price updated successfully',
                payload: crop
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    // updateStartingBid : UPDATE Endpoint - For updating the starting bid of a Product in the list
    app.put('/updateStartingBid/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let crop = await cropListingCollection.findOne({ id: ID });
            if (!crop) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            let newStartingBid = req.body.startingBid;
            await cropListingCollection.updateOne({ id: ID }, { $set: { StartingBid: newStartingBid } });
            res.send({
                message: 'Starting Bid updated successfully',
                payload: crop
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    // updateTypeOfListing : UPDATE Endpoint - For updating the Type of Listing of a Product in the list
    app.put('/updateTypeOfListing/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let crop = await cropListingCollection.findOne({ id: ID });
            if (!crop) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            let newTypeOfListing = req.body.typeOfListing;
            await cropListingCollection.updateOne({ id: ID }, { $set: { TypeOfListing: newTypeOfListing } });
            res.send({
                message: 'Type of Listing updated successfully',
                payload: crop
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    // deleteListing/:id : DELETE Endpoint - For deleting a Product from the list
    app.delete('/deleteListing/:id', async (req, res) => {
        try {
            let ID = Number(req.params.id);
            let crop = await cropListingCollection.findOne({ id: ID });
            if (!crop) {
                res.status(404).send({
                    message: 'Crop not found'
                });
                return;
            }
            await cropListingCollection.deleteOne({ id: ID });
            res.send({
                message: 'Crop deleted successfully',
                payload: crop
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred',
                error: error.message
            });
        }
    });


    // App Listennig at PORT
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    });
}).catch(err => {
    console.log('Error in connecting to MongoDB');
});