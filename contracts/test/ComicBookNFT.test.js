const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComicBookNFT", function () {
  let comicBookNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ComicBookNFT = await ethers.getContractFactory("ComicBookNFT");
    comicBookNFT = await ComicBookNFT.deploy(owner.address);
    await comicBookNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await comicBookNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await comicBookNFT.name()).to.equal("Comic Book Collection");
      expect(await comicBookNFT.symbol()).to.equal("COMIC");
    });
  });

  describe("Minting", function () {
    it("Should mint a new comic NFT", async function () {
      const tx = await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      await tx.wait();

      expect(await comicBookNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await comicBookNFT.totalSupply()).to.equal(1);
    });

    it("Should emit ComicMinted event", async function () {
      await expect(
        comicBookNFT.mintComicNFT(
          addr1.address,
          "Amazing Spider-Man",
          "Marvel",
          "1",
          "Near Mint",
          "ipfs://test-uri"
        )
      ).to.emit(comicBookNFT, "ComicMinted");
    });

    it("Should store comic details correctly", async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      const details = await comicBookNFT.getComicDetails(0);
      expect(details.title).to.equal("Amazing Spider-Man");
      expect(details.publisher).to.equal("Marvel");
      expect(details.issueNumber).to.equal("1");
      expect(details.condition).to.equal("Near Mint");
    });

    it("Should not allow duplicate minting of same comic", async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      await expect(
        comicBookNFT.mintComicNFT(
          addr1.address,
          "Amazing Spider-Man",
          "Marvel",
          "1",
          "Near Mint",
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("This comic has already been minted");
    });

    it("Should not mint to zero address", async function () {
      await expect(
        comicBookNFT.mintComicNFT(
          ethers.ZeroAddress,
          "Amazing Spider-Man",
          "Marvel",
          "1",
          "Near Mint",
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("Cannot mint to zero address");
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint multiple comics", async function () {
      const titles = ["Amazing Spider-Man", "Batman", "Superman"];
      const publishers = ["Marvel", "DC", "DC"];
      const issueNumbers = ["1", "1", "1"];
      const conditions = ["Near Mint", "Fine", "Very Good"];
      const uris = ["ipfs://uri1", "ipfs://uri2", "ipfs://uri3"];

      await comicBookNFT.batchMintComics(
        addr1.address,
        titles,
        publishers,
        issueNumbers,
        conditions,
        uris
      );

      expect(await comicBookNFT.totalSupply()).to.equal(3);
      expect(await comicBookNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await comicBookNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await comicBookNFT.ownerOf(2)).to.equal(addr1.address);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );
    });

    it("Should transfer NFT between accounts", async function () {
      await comicBookNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await comicBookNFT.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should emit ComicTransferred event on transfer", async function () {
      await expect(
        comicBookNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.emit(comicBookNFT, "ComicTransferred");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      expect(await comicBookNFT.tokenURI(0)).to.equal("ipfs://test-uri");
    });

    it("Should allow owner to update token URI", async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      await comicBookNFT.connect(addr1).updateTokenURI(0, "ipfs://new-uri");
      expect(await comicBookNFT.tokenURI(0)).to.equal("ipfs://new-uri");
    });
  });

  describe("Burning", function () {
    it("Should allow owner to burn their NFT", async function () {
      await comicBookNFT.mintComicNFT(
        addr1.address,
        "Amazing Spider-Man",
        "Marvel",
        "1",
        "Near Mint",
        "ipfs://test-uri"
      );

      await comicBookNFT.connect(addr1).burn(0);

      await expect(comicBookNFT.ownerOf(0)).to.be.reverted;
    });
  });
});
