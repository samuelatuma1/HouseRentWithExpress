const User = require("../models/usermodel.js")
const crypto = require("crypto")
require("dotenv").config()
const {
    GraphQLObjectType,
    GraphQLBoolean, GraphQLList,
    GraphQLID, GraphQLBoolean, GraphQLString
} = require("graphql")

const UserType = new GraphQLObjectType({
    name: "UserType",
    description: `() : _id: GraphQLID, fullName: string, email: string, isActive : boolean | null, password: string`,
    fields: {
        _id: {type: GraphQLID},
        fullName: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        isActive: {
            type: GraphQLBoolean,
            defaultValue: true
        },
        password: {
            type: GraphQLString
        }
    }
})
const UserField = {
    name: "User",
    type: GraphQLNonNull(UserType),
    args: {
        id: GraphQLID
    },
    resolve: (parent, args) => {
        return User.findById(args.id).select("-__v")
    }
}

const UsersFields = {
    name: "User",
    type: GraphQLList(UserType),
    args: {
    
    },
    resolve: (parent, args) => {
        return User.find({})
    }
}


// Add user function

async function addUser(fullName, email, password){
    try{
        // hash password 
        const hashPassword = crypto.createHmac("sha256", process.env.SECRET_KEY)
        .update(password).digest("hex");
        const newUser = await User.create({fullName, email, hashPassword})
        return await newUser.save()
    } catch(err){
        return 
    }
}
const AddUserField = new GraphQLObjectType({
    name: "AddUser",
    description: `(fullName : string, email: string, password: string)`,
    type: new GraphQL
})