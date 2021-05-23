import { ethers, waffle } from "hardhat";
const { deployContract } = waffle;
import { MoonboxNFT } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import MoonboxNFTArtifact from "../artifacts/contracts/MoonboxNFT.sol/MoonboxNFT.json";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const { expect } = chai;

describe("MoonboxNFT", () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let moonboxNFT: MoonboxNFT;
  let moonboxNFTByAlice: MoonboxNFT;
  let moonboxNFTByBob: MoonboxNFT;

  beforeEach(async () => {
    [owner, alice, bob, carol] = await ethers.getSigners();
    moonboxNFT = (await deployContract(
      owner,
      MoonboxNFTArtifact
    )) as MoonboxNFT;
    moonboxNFTByAlice = moonboxNFT.connect(alice);
    moonboxNFTByBob = moonboxNFT.connect(bob);
  });

  describe("#setMinter", () => {
    it("should set minter correctly", async () => {
      expect(await moonboxNFT.isMinter(alice.address)).to.be.false;
      expect(await moonboxNFT.isMinter(bob.address)).to.be.false;
      await moonboxNFT.setMinter(alice.address, true);
      expect(await moonboxNFT.isMinter(alice.address)).to.be.true;
      await moonboxNFT.setMinter(alice.address, false);
      expect(await moonboxNFT.isMinter(alice.address)).to.be.false;
      await moonboxNFT.setMinter(bob.address, false);
      expect(await moonboxNFT.isMinter(bob.address)).to.be.false;
      expect(moonboxNFTByAlice.setMinter(alice.address, true)).to.be.reverted;
    });
  });

  describe("#setURI", () => {
    it("should set uri correctly", async () => {
      expect(await moonboxNFT.uri(1)).to.not.be.empty;
      await moonboxNFT.setURI("");
      expect(await moonboxNFT.uri(1)).to.be.empty;
      expect(moonboxNFTByAlice.setURI("")).to.be.reverted;
    });
  });

  describe("#mint", () => {
    it("should mint correctly", async () => {
      await moonboxNFT.setMinter(alice.address, true);
      await moonboxNFTByAlice.mint(carol.address, 1, 10);
      expect(await moonboxNFT.balanceOf(carol.address, 1)).to.eq(10);
      await moonboxNFTByAlice.mint(carol.address, 2, 20);
      expect(await moonboxNFT.balanceOf(carol.address, 2)).to.eq(20);
      await moonboxNFTByAlice.mint(carol.address, 1, 1);
      expect(await moonboxNFT.balanceOf(carol.address, 1)).to.eq(11);
      expect(moonboxNFTByBob.mint(carol.address, 1, 1)).to.be.revertedWith(
        "MoonboxNFT::mint: Caller is not a minter"
      );
    });
  });

  describe("#burn", async () => {
    it("should burn correctly", async () => {
      await moonboxNFT.setMinter(alice.address, true);
      await moonboxNFTByAlice.mint(bob.address, 1, 10);
      await moonboxNFTByBob.burn(1, 1);
      expect(await moonboxNFT.balanceOf(bob.address, 1)).to.eq(9);
      expect(moonboxNFTByBob.burn(1, 10)).to.be.revertedWith("ERC1155: burn amount exceeds balance");
      expect(moonboxNFTByAlice.burn(1, 1)).to.be.revertedWith("ERC1155: burn amount exceeds balance");
    });
  });

  describe("#burnBatch", async () => {
    it("should burn batch correctly", async () => {
      await moonboxNFT.setMinter(alice.address, true);
      await moonboxNFTByAlice.mint(bob.address, 1, 10);
      await moonboxNFTByAlice.mint(bob.address, 2, 20);
      await moonboxNFTByAlice.mint(bob.address, 3, 30);
      await moonboxNFTByBob.burnBatch([1, 2, 3], [1, 1, 0]);
      expect(await moonboxNFT.balanceOf(bob.address, 1)).to.eq(9);
      expect(await moonboxNFT.balanceOf(bob.address, 2)).to.eq(19);
      expect(await moonboxNFT.balanceOf(bob.address, 3)).to.eq(30);
      expect(moonboxNFTByBob.burnBatch([1, 2, 3], [10, 20, 30])).to.be.revertedWith("ERC1155: burn amount exceeds balance");
      expect(moonboxNFTByAlice.burn([1], [1])).to.be.revertedWith("ERC1155: burn amount exceeds balance");
    });
  });
});
