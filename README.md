## Final Project for Brainnest Internship
## NFT_Dapp
    NFT Dapp where people can mint Brainnest's NFTs, maxSupply=50
    maxSupply is setup in the constructor(50)
    there are privateMint and publicMint(publicMint is true since the begining)
    privateMint(payable) --> only users with allowance(mapping) can mint sending 0,001 ether
    publicMint(payable) --> any user can mint sending 0,000001 ether
    onlyOwner can set the allowance to any wallet
    onlyOwner can open/close the privateMint and publicMint
    withdraw balance of the contract - onlyOwner

## Website deployed to 
https://bold-queen-5724.on.fleek.co
