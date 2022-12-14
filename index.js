const express = require('express')
const cors = require('cors')


const app = express()

//Config  Json response


app.use(express.json())

//solve CORS

app.use(cors({credentials:true,origin:'http://localhost:3000'}))


//Public folder for images

app.use(express.static('public'))

//routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetsRoutes')
app.use('/users',UserRoutes)
app.use('/pets',PetRoutes)


app.listen(8080)