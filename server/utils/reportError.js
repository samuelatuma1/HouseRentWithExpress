const fs = require("node:fs/promises")

async function reportErr(err, req){
    try{
        const errMsg = `\n #######################################################################################
        Path: ${req.path}\n
        Request Body: ${req.body && JSON.stringify(req.body)}
        Request Query: ${req.query && JSON.stringify(req.query)}
        Request Params: ${req.params && JSON.stringify(req.params)}
        method: ${req.hasOwnProperty("method") && req.method}\n
        Error: ${err}\n
        ###################################################################################
        \n`
        await fs.appendFile("./error.txt", errMsg)
        
    }catch(err){
        console.log("Unable to view error")
    }
}
module.exports = {reportErr}