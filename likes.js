// Removing files
const fs = require("fs").promises

async function delHello(){
    try{
        await fs.unlink("./media/hello.txt")
        console.log("hello.txt deleted")
    }  catch(err){
        console.log(err)
    }
}

// Test out Multer on upload route
// const upload = require("./middlewares/houseFileUploadHandler")
// app.post("/upload", upload.fields([
//     {name: "profilePic", maxCount: 2}
// ]), (req, res) => {
//     const imgUrls = []
//     for(let fileName  in req.files) {
//         const files = req.files[fileName]
//         for(let fileData of files){
//             imgUrls.push(fileData.path)
//             console.log('filepath => ', fileData.path)
//         }
//     }
//     return res.send(imgUrls)
// })



// delHello()

console.log("arr =>", Array.from(new Set([1, 3, 4])).map(x => x **9))