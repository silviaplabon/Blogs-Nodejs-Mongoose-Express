const UsersCollection = require('../models/usersCollection');
const CONSTANTS = require('../utils/constants');
const { encryptedPassword } = require('../utils/passwordSettings');
const usersData = {
    getAllUser: async (req, res) => {
        const data = await UsersCollection.find({});
        return data;
    },
    addAUser: async (req, res) => {
        const newUser = req.body;
        const ObjectID = require('mongodb').ObjectID;
        newUser._id = new ObjectID()
        newUser.createdTime = Date.now()
        const insertedOutput = {
            "id": newUser._id,
            "error": "",
            "isInserted": false,
            user:{}
        }
        const username =req.body.email
        const password = req.body.password
        const user = await UsersCollection.findOne({ email: username });
        console.log(user,"@@@@@@@@")
        if (user && user.email) {
            insertedOutput._id = ""
            insertedOutput.error = CONSTANTS.MESSAGES.RECORD_ALREADY_EXISTS
            
        } else {
            req.body.password = await encryptedPassword(password);
            await UsersCollection.create({ ...newUser })
                .then(result => {
                    console.log(result, "result")

                    insertedOutput.isInserted = true
                    insertedOutput.user=result
          
                })
                .catch((e) => {
                    insertedOutput.id = ""
                    insertedOutput.error = e.message;
                  
                })
            }
            return insertedOutput
       
    },
    getAUser: async (req, res) => {
        return UsersCollection.findOne({ _id: req.params.id });
    },
    updateAUser: async (req, res) => {
        let updatedOutput = {
            "modifiedCount": 0,
            "errorMessage": ""
        }
        console.log({ ...req.body })
        await UsersCollection.updateOne({ _id: req.params.id },
            {
                $set: { ...req.body }
            })
            .then(async (result) => {
                updatedOutput.modifiedCount = await result.modifiedCount;
            })
            .catch((e) => {
                updatedOutput.errorMessage = e.message
            })
        return updatedOutput
    },
    deleteAUser: async (req, res) => {
        let deletedOutput = {
            "deletedCount": 0,
            "errorMessage": ""
        }
        await UsersCollection.deleteOne({ _id: req.params.id })
            .then(async (result) => {
                deletedOutput.deletedCount = await result.deletedCount
            })
            .catch((e) => {
                deletedOutput.errorMessage = e.message
            })
        return deletedOutput
    },
    getFilterUsers: async (req, res) => {
        let query = {};
        const data = await UsersCollection.find({ ...query });
        return data;
    },
    getAUserByEmail: async (email) => {
        return UsersCollection.findOne({ email: email });
    }

}

module.exports = usersData;
