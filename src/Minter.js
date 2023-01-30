import React from 'react'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {abi} from "./artifacts/contracts/BrainnestNFT.sol/BrainnestNFT.json"
const BrainnestAddress = "0x1C2141Ea1DF312eCed99078fE043d229C73bB4F0"

let provider = {}, contract = {}, walletAdd=""; 

const Minter = (props) => {

  //State variables
  //const [providerState, setProviderState] = useState({});
  const [walletAddress, setWalletAddress] = useState(0);
  const [network, setNetwork] = useState(undefined)
  const [balance, setBalance] = useState(0)
  const [nameNFT, setNameNFT] = useState("")
  const [descriptionNFT, setDescriptionNFT] = useState("")
  const [imageNFT, setImageNFT] = useState("")
  const [totalSupply, setTotalSupply] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [error, setError] = useState("")
  const jsonLink = "https://bafkreidos2qmg7r6f6ykn5aoqcue2nshfkg2v3vcr7r7d5zh6dcuj3e2i4.ipfs.nftstorage.link/"

  useEffect(()=>{ 
    /* 
      1. connect to provider, set the provider and the network
      2. call initContract()
    */
    const init = async ()=>{
      provider = new ethers.providers.Web3Provider(window.ethereum)
      //setProviderState(provider)
      setNetwork((await provider._networkPromise)['name'])
      if(network === "goerli"){
        await initContract()
        await showNFT()
      }
    }
    init()
  },[])


  const initContract = async()=>{   
    /* 
      1. get signer from provider and set the wallet address to the react state
      2. instance of contract with the signer, to avoid signing later
    */
   const signer = provider.getSigner();
   setWalletAddress(await signer.getAddress())
   walletAdd = await signer.getAddress()
   contract = new ethers.Contract(BrainnestAddress,abi,signer)
 
   const bal = parseInt(await contract.balanceOf(walletAdd), 16)
   setBalance(bal)
 
  }
  
  const connectWalletPressed = async () => {
    /*
      1. request accounts in metamask and setWallet (the address of the signer) - signer is an object, address a string
      2. call initContract()
    */
    await provider.send("eth_requestAccounts", []);
    await initContract()
    await showNFT()
    
  };


  const onMintPressed = async (evt) => {
    /*
      1. prevent page refresh
      2. get the value of the ethers from the input
      3. call the function publicMint in the contract sending the eth value
    */

   try{
      evt.preventDefault()
      const valueEth = evt.target.ethersValue.value
      const tx = { value: ethers.utils.parseEther(valueEth)}
      setError("")
      await contract.publicMint(tx)
      document.location.reload(true)
    }catch(err){
      setError("Please connect your wallet")
      if(balance === 1){
        setError("Sorry, you already own 1 NFT")
      }
      console.log("PLEASE CONNECT YOUR WALLET/YOU ALREADY OWN 1 NFT")

    }

  };

  const showNFT = async() =>{
    try{
      let response = await (await fetch("https://bafkreidos2qmg7r6f6ykn5aoqcue2nshfkg2v3vcr7r7d5zh6dcuj3e2i4.ipfs.nftstorage.link/")).json()
      setNameNFT(response.name)
      setDescriptionNFT(response.description)
      setImageNFT(response.image)
      setTotalSupply((parseInt((await contract.totalSupply())._hex)).toString())
      setMaxSupply((parseInt((await contract.maxSupply())._hex)).toString())
    }catch(err){
      console.log("ERROR SHOWING NFT")
    }
  }

  const connectMetamaskMain = async () => { 
    await changeMainNetwork();
    document.location.reload(true)
  };
  //Change network to goerli
  const changeMainNetwork = async () => {
    try {
      await window.ethereum.request({
          "id": 1,
          "jsonrpc": "2.0",
          "method": "wallet_switchEthereumChain",
          "params": [
            {
              "chainId": "0x5",
            }
          ]
      })
    }catch (err) {
      console.log("ERROR CHANGING NETWORK");
    }
  };

  return (
    <div>
      {network === "goerli" ? 
      (<div className='App-header'>

        {/* connect wallet button and init the contract*/}
          <div className='headerr'> 
            <h1 id="title">🧙‍♂️Brainnest NFT Minter</h1>
            <button className='button-black' id="walletButton" onClick={connectWalletPressed}>
              {walletAddress.length > 0 ? (
                "Connected: " +
                String(walletAddress).substring(0, 6).toLowerCase() +
                "..." +
                String(walletAddress).substring(38).toLowerCase()
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
        </div>
      
        {/* set ETH value and Mint NFT */}
        <div className='container'>
          <div className='tooltip'>
            Mint your NFT here <i className="fa fa-arrow-circle-down"></i><span className='tooltiptext'>minimum 0.000001 ETH</span>
          </div>
          <form className="formm" onSubmit={onMintPressed}>
            <input type={"number"} name="ethersValue" min="0.00001" step="0.001" defaultValue={0.00001} required  />
            <button className='button-black' id="mintButton" >
              Mint NFT
            </button>
          </form>
          {error === "" ? 
          (<span className='error'>{error}</span>): 
          (<span className='error'>{error}</span>)}
        
        </div>
      
      {/* Show your NFT here */}
        <div>
            {balance === 0 ? (
            <div>
              <p>You have 0 NFT, please mint to see your NFT here</p>
            </div>): 
            <div className='nft'>
              <p><a target={"_blank"} href='https://testnets.opensea.io/collection/brainnest-721'>View collection in OpenSea</a></p>
              <p>{totalSupply}/{maxSupply} Minted NFTs</p>
              <div className='nftinfo'>
                <img src={imageNFT} alt={"NFT"}/>
                <p>Name: {nameNFT}</p>
                <p>Description: {descriptionNFT} </p>
                <p>JSON File: <a href='https://bafkreidos2qmg7r6f6ykn5aoqcue2nshfkg2v3vcr7r7d5zh6dcuj3e2i4.ipfs.nftstorage.link/'>{jsonLink}</a></p>
                
              </div>
              
            </div>
            }

        </div>
      </div>)
      :
      (<div className='App-header'>
        <div className='container'>
            <button onClick={()=>connectMetamaskMain("goerli")} className='button-black'>Switch to Goerli Network</button>
        </div>
      </div>)
      }
      

    </div>
  );
};

export default Minter;
