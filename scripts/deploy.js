
const hre = require("hardhat");
const upload = require("./upload")

async function main() {
  const BrainnestNFT = await hre.ethers.getContractFactory("BrainnestNFT");
  const brainnestNFT = await BrainnestNFT.deploy(50);

  await brainnestNFT.deployed();

  console.log("BrainnestNFT Deployed to",brainnestNFT.address)

  const result = await upload("BRAINNEST.png", "BrainnestNFT","This is the NFT for Brainnest's final project")
  console.log("NFT Meta URL:",result.url)
  //await brainnestNFT.publicMint(result.url)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
