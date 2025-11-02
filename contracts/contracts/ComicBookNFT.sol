// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ComicBookNFT
 * @dev ERC721 NFT contract for representing comic book ownership
 * Each NFT represents a physical comic book in a user's collection
 */
contract ComicBookNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to comic book details
    mapping(uint256 => ComicDetails) public comicDetails;

    // Mapping to track if a comic hash has been minted (prevent duplicates)
    mapping(bytes32 => bool) public comicMinted;

    struct ComicDetails {
        string title;
        string publisher;
        string issueNumber;
        string condition;
        uint256 mintedAt;
        address originalMinter;
    }

    event ComicMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string title,
        string publisher,
        string issueNumber
    );

    event ComicTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor(address initialOwner)
        ERC721("Comic Book Collection", "COMIC")
        Ownable(initialOwner)
    {}

    /**
     * @dev Mint a new comic book NFT
     * @param to Address to mint the NFT to
     * @param title Comic book title
     * @param publisher Publisher name
     * @param issueNumber Issue number
     * @param condition Condition of the comic
     * @param uri Metadata URI
     */
    function mintComicNFT(
        address to,
        string memory title,
        string memory publisher,
        string memory issueNumber,
        string memory condition,
        string memory uri
    ) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");

        // Create a unique hash for this comic
        bytes32 comicHash = keccak256(abi.encodePacked(
            msg.sender,
            title,
            publisher,
            issueNumber
        ));

        require(!comicMinted[comicHash], "This comic has already been minted");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        comicDetails[tokenId] = ComicDetails({
            title: title,
            publisher: publisher,
            issueNumber: issueNumber,
            condition: condition,
            mintedAt: block.timestamp,
            originalMinter: msg.sender
        });

        comicMinted[comicHash] = true;

        emit ComicMinted(tokenId, to, title, publisher, issueNumber);

        return tokenId;
    }

    /**
     * @dev Update metadata URI for a token (only by owner)
     * @param tokenId Token ID to update
     * @param uri New metadata URI
     */
    function updateTokenURI(uint256 tokenId, string memory uri) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not authorized");
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Get comic details for a token
     * @param tokenId Token ID to query
     */
    function getComicDetails(uint256 tokenId) public view returns (ComicDetails memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return comicDetails[tokenId];
    }

    /**
     * @dev Get total number of minted comics
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Override transfer function to emit custom event
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        address result = super._update(to, tokenId, auth);

        if (from != address(0) && to != address(0)) {
            emit ComicTransferred(tokenId, from, to);
        }

        return result;
    }

    /**
     * @dev Batch mint multiple comics at once
     * @param to Address to mint the NFTs to
     * @param titles Array of comic titles
     * @param publishers Array of publishers
     * @param issueNumbers Array of issue numbers
     * @param conditions Array of conditions
     * @param uris Array of metadata URIs
     */
    function batchMintComics(
        address to,
        string[] memory titles,
        string[] memory publishers,
        string[] memory issueNumbers,
        string[] memory conditions,
        string[] memory uris
    ) public returns (uint256[] memory) {
        require(titles.length == publishers.length, "Array length mismatch");
        require(titles.length == issueNumbers.length, "Array length mismatch");
        require(titles.length == conditions.length, "Array length mismatch");
        require(titles.length == uris.length, "Array length mismatch");

        uint256[] memory tokenIds = new uint256[](titles.length);

        for (uint256 i = 0; i < titles.length; i++) {
            tokenIds[i] = mintComicNFT(
                to,
                titles[i],
                publishers[i],
                issueNumbers[i],
                conditions[i],
                uris[i]
            );
        }

        return tokenIds;
    }

    // The following functions are overrides required by Solidity

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
