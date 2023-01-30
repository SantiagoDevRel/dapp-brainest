// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BrainnestNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Pausable,
    Ownable
{
    using Counters for Counters.Counter;
    uint256 public maxSupply;

    bool public publicMintAllow = true;
    bool public privateMintAllow = false;

    mapping(address => bool) public isAllowed;
    mapping(uint256 => string) private _tokenURIs;

    Counters.Counter private _tokenIdCounter;

    constructor(uint256 _maxSupply) ERC721("Brainnest721", "BNST") {
        maxSupply = _maxSupply;
    }

    //Give allowance to privateMint
    function setAllowance(address _user) public onlyOwner {
        isAllowed[_user] = !isAllowed[_user];
    }

    function getAllowance(address _user) public view returns (bool) {
        return isAllowed[_user];
    }

    /*
     * Modify mint state (close or open)
     * send 0 as a parameter to closed/open the publicMint
     * send 1 as a parameter to closed/open the privateMint
     */
    function editMints(uint _public0private1) external onlyOwner {
        require(
            _public0private1 == 0 || _public0private1 == 1,
            "Wrong command"
        );
        if (_public0private1 == 0) {
            publicMintAllow = !publicMintAllow;
        } else if (_public0private1 == 1) {
            privateMintAllow = !privateMintAllow;
        }
    }

    /*
     * Owner can withdraw the balance of the contract
     */
    function withdraw(address _addr) external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
    }

    /*
     * Mint for the private list
     * only users with allowance can mint
     * only users can mint when privateMint is true (open)
     * only users can mint when they send 0.001 ether or more
     */
    function privatetMint() public payable {
        require(getAllowance(msg.sender), "You are not allowed to mint");
        require(privateMintAllow, "Private mint closed");
        require(msg.value >= 0.000001 ether, "Not enough funds");
        _mint();
    }

    /*
     * Mint for the public
     * publicMint needs to be true(open)
     * users must send 0.01 ether or more
     */
    function publicMint() public payable {
        require(publicMintAllow, "Public mint closed");
        require(msg.value >= 0.0000001 ether, "Not enough funds");
        _mint();
    }

    /*
     * Internal function to mint, only called by publicMint() and privateMint()
     * check if there is still supply available to mint
     * check that the current sender doesn't has minted already (only 1 NFT per wallet)
     * update the counter (token id)
     * call safeMint from the ERC721 parent
     */
    function _mint() internal returns (uint256) {
        require(totalSupply() < maxSupply, "Sold out");
        require(balanceOf(msg.sender) == 0, "You can only have 1 NFT");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        string
            memory URI = "https://bafkreidos2qmg7r6f6ykn5aoqcue2nshfkg2v3vcr7r7d5zh6dcuj3e2i4.ipfs.nftstorage.link/";
        _setTokenURI(tokenId, URI);
        _tokenURIs[tokenId] = URI;
        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        //string memory base = _baseURI();
        return string(abi.encodePacked(_tokenURI));
    }
}
