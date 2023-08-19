import {ethers} from "hardhat";
import {expect} from "chai"

describe("ERC20 contract states", function () {
    it("getters", async function () {
        const ERC20 = await ethers.getContractFactory("ERC20")
        const erc20 = await ERC20.deploy("Zenny", "ZNY", 18)
        await erc20.waitForDeployment()

        expect(await erc20.name()).to.equal("Zenny")
        expect(await erc20.symbol()).to.equal("ZNY")
        expect(await erc20.decimals()).to.equal(18)
        expect(await erc20.totalSupply()).to.equal(0)
    })
})