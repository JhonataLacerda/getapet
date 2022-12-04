const { json } = require('express')
const { get } = require('mongoose')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const Pet = require('../models/Pets')
const { updateMany, update } = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class PetController {


    //Create a pet

    static async create(req, res) {

        const { name, age, weight, color } = req.body
        const images = req.files
        const available = true

        //Image upload

        //validations

        if (!name) {
            res.status(422).json({
                message: "O nome é obrigatório!"
            })
            return
        }
        if (!age) {
            res.status(422).json({
                message: "A idade é obrigatória!"
            })
            return
        }
        if (!weight) {
            res.status(422).json({
                message: "O peso é obrigatório!"
            })
            return
        }

        if (!color) {
            res.status(422).json({
                message: "A cor é obrigatório!"
            })
            return
        }

        if (images.length === 0) {
            res.status(422).json({
                message: "A imagem é obrigatória!"
            })
        }

        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //Create a pet


        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })
        try {

            const newPet = await pet.save()
            res.status(201).json({
                message: "Pet cadastrado com sucesso!",
                newPet,
            })

        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({
            pets: pets,

        })
    }

    static async getAllUserPets(req, res) {

        //Get user from  token

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
        res.status(200).json({
            pets: pets,
        })
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {

            res.status(422).json({
                message: "ID INVÁLIDO!"
            })
            return


        }

        //Get pet by ID
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
        }

        res.status(200).json({
            pet: pet,
        })


    }

    static async removePetById(req, res) {

        //Check if Id is valid
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({
                message: 'ID INVÁLIDO!'
            })
            return
        }

        //Checkif pet exists
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({
                message: 'Pet não encontrado!'
            })
            return
        }

        //Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message: 'Houve um problema em processar a sua solicitação!'
            })
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({
            message: "Pet removido com sucesso!"
        })
    }


    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, available } = req.body
        const images = req.files

        const updatedData = {}


        //Check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({
                message: 'Pet não encontrado!'
            })
            return
        }

        //Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message: 'Houve um problema em processar a sua solicitação!'
            })
            return
        }

        if (!name) {
            res.status(422).json({
                message: "O nome é obrigatório!"
            })
            return
        } else{
            updatedData.name = name
        }
        if (!age) {
            res.status(422).json({
                message: "A idade é obrigatória!"
            })
            return
        } else{
            updatedData.age = age
        }
        if (!weight) {
            res.status(422).json({
                message: "O peso é obrigatório!"
            })
            return
        } else{
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({
                message: "A cor é obrigatório!"
            })
            return
        } else {
            updatedData.color = color
        }

        if (images.length === 0) {
            res.status(422).json({
                message: "A imagem é obrigatória!"
            })
        } else{
            updatedData.images = []
            images.map((image)=>{
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({
            message: "Pet atualizado com sucesso!"
        })

    }



}