const express = require("express")
const api = express()
const mongoose = require("mongoose")

const flatSchema = new mongoose.Schema({
    address_full: {
        type: String,
        required: true
    },
    district: String,
    area_sqm: Number,
    rooms: {
        type: Number,
        default: 1
    },
    rent: Number,
    landlord: String
}, {versionKey: false})

const Flat = mongoose.model("flat", flatSchema)

// CONNECT TO MONGODB
const dbName = "flats"
const connOptions = {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}
mongoose.connect(`mongodb://localhost/${dbName}`, connOptions)

// USE JSON MIDDLEWARE, SO WE CAN CALL OUR API WITH FETCH & JSON DATA FROM THE BROWSER
api.use(express.json())

// CORS
api.use((req, res, next) => {
    res.set("ACCESS-CONTROL-ALLOW-ORIGIN", "*")
    res.set("ACCESS-CONTROL-ALLOW-HEADERS", "*")
    res.set("ACCESS-CONTROL-ALLOW-METHODS", "*")
    next()
})

// OPEN THE PORT
api.listen(3000, () => console.log("Listening on port 3000"))

// GET ALL FLATS
api.get("/flat", async (req, res, next) => {
    let flats = await Flat.find()
    res.send(flats)
})

// GET ONE FLAT
api.get("/flat/:id", async (req, res, next) => {
    let id = req.params.id
    console.log("Param: ",  id)

    try {
        let flat = await Flat.findById(id)
        res.send(flat)
    }
    catch(err) {
        next(err)
    }
})

// CREATE FLAT
api.post("/flat", async (req, res, next) => {
    let flatPosted = req.body
    console.log("Flat posted:", flatPosted)

    try {
        let flatCreated = await Flat.create(req.body)
        res.send(flatCreated)
    }
    catch(err) {
        next(err)
    }
})

// UPDATE FLAT
api.patch("/flat/:id", async (req, res, next) => {
    let id = req.params.id
    let flatUpdate = req.body
    console.log("Param: ", id)
    console.log("Flat patch sent:", flatUpdate)
    
    // the option {new: true} has the effect that we get 
    // the UPDATED document back after update operation.
    try {
        let flatUpdated = await Flat.findByIdAndUpdate(id, flatUpdate, {new: true})
        res.send(flatUpdated)
    }
    catch(err) {
        next(err)
    } 
})

api.delete("/flat/:id", async (req, res, next) => {
    let id = req.params.id
    console.log("Param:", id)
    
    try {
        let flatDeleted = await Flat.findByIdAndDelete(id)
        res.send(flatDeleted)
    }
    catch(err) {
        next(err) 
    }
})

// OUR ERROR HANDLER FOR ALL OUR EXPRESS & MONGOOSE
api.use((err, req, res, next) => {
    let errMessage = err.message || err
    let errStatus = err.status || 500
    res.status(errStatus).send({error: errMessage})
})

/**
 * FETCH statements:
 * 
 * GET: fetch('http://localhost:3000/flat')
 * GET: fetch('http://localhost:3000/flat/15')
 * POST: fetch('http://localhost:3000/flat', 
{method: "POST", 
headers: {"Content-Type": "application/json" },
body: JSON.stringify({    
    address_full: "Turmstraße 33, 10551 Berlin",
    district: "Tiergarten",
    area_sqm: 65,
    rent: 645,
    landlord: "Flatify GmbH"
})}
)
.then(res => res.json())
.then(data => console.log(data))

   PATCH: fetch('http://localhost:3000/flat/15', {
             method: "PATCH", headers: {"Content-Type": "application/json"},
             body: JSON.stringify({firstname: "FirstnameNew", lastname: "LastnameNew"})
         })
   DELETE: fetch('http://localhost:3000/flat/7', { method: "DELETE" })
         })
*/
