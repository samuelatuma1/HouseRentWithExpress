const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/PostsDB")

const UserSchema = new mongoose.Schema({
    username: String,
    posts: {
        type: [mongoose.ObjectId],
        default: []
    }
})

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    post: {
        type: String,
        default: "Hello, this is my new post"
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Object,
        default: {}
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
UserSchema.methods.getData = function (){
    return this
}
PostSchema.virtual("fill").get(async function(){
    var users = []
    for(let userId in this.likes){
        
            let user =await User.findById(userId)
            users.push(user)
        
    }
    return users
})
PostSchema.methods.like = function(userId){
    if(this.likes.hasOwnProperty(userId)){
        delete this.likes[userId]
        this.likesCount--
    } else{
        this.likes[userId] = 1
        this.likesCount++
    }
    console.log(this)
    return this
}
const User = mongoose.model("UserCollection3", UserSchema)
const Post = mongoose.model("PostCollection3", PostSchema)
async function create(){
    let me = await User.create({username : "Pete"})
    console.log(me.getData())

     me = await User.create({username : "Sam"})
    console.log(me.getData())

    me = await User.create({username : "Pam"})
    console.log(me.getData())
}
// create()

async function createPost(){
    // console.log(await User.deleteMany())
    // console.log(await Post.deleteMany())
    const myFirstPost = await Post.findOne()
    // const likes = myFirstPost.like("62ca83f044bd42f2e6d36ac9")
    const allUsers = await User.where()
    for(let user of allUsers){
        myFirstPost.like(user._id)
    }
    console.log(await myFirstPost.fill)
}
// createPost()
// async function getUsers(){
//     const allUsers =  await User.where()
//     console.log(allUsers)
// }

// getUsers()

function allUsers(){
    User.find({}, async (err, all) => {
        
        let users = all.map(user => {
            user['longName']='Samuel Atuma Okpara Saake';
            // console.log(user)
            return user
        })
    })
}
allUsers()