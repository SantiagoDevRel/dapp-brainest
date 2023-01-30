const {NFTStorage, File} = require("nft.storage");
const mime = require("mime")
const fs = require("fs")
const path = require("path")

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFDRjVhZDk0RTAwZkJhNzYzNDg2RTc1YTQyQjlhODY1QjI5MUY3NTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTAxODE1MTIwNywibmFtZSI6ImJyYWlubmVzdCJ9.BE0_NZPhLMCZO8y1dVz4AAEnxsUYIw0HNWwIcjvsWO8"

async function fileFromPath(filePath) {

    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    return new File([content], path.basename(filePath), { type });
  }

async function storeNFT(imagePath, name, description){
    const image = await fileFromPath(imagePath)
    const nftStorage = new NFTStorage({token: NFT_STORAGE_KEY})
    
    return nftStorage.store({image, name, description})
}

async function main(imagePath, name, description){
    console.log( await storeNFT(imagePath, name, description))

    return await storeNFT(imagePath, name, description);
}

if(require.main === module){
    try{
        main("BRAINNEST.png", "BrainnestNFT", "This is the NFT for the final project")
    }
    catch(err){
        console.log("ERROR WHILE CREATING THE NFT:", err)
    }
}

module.exports = main;
