const Joi = require('joi')
const express = require("express")
const app = express();

const VALUES = [1, 2, 3];

// middleware to parse body of request data as json
app.use(express.json())

app.get("/api/courses", (req, res) => {
    res.send(VALUES)
})

app.get("/api/courses/:id", (req, res) => {
    const schema = Joi.object({
        name: Joi.number().min(0).max(2).required()
    })

    const result = schema.validate({name: parseInt(req.params.id)})
    if (result.error) {
        return res.status(400).send(result.error)
    }
    res.send(`${VALUES[req.params.id]}`)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})


// req.params
// req.query
// req.body // require express json middleware