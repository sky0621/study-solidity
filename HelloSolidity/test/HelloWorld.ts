import {ethers} from "hardhat";
import {expect} from "chai"

describe("HelloWorld contract", function () {
    it("getMessage returns HelloWorld", async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld")
        const helloworld = await HelloWorld.deploy()
        await helloworld.waitForDeployment()

        console.log(await helloworld.getAddress())
        expect(await helloworld.getMessage()).to.equal("Hello World")
    })
})
