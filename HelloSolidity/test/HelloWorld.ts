import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld contract", function () {
    it('getMessage returns HelloWorld', async function () {
        const [owner] = await ethers.getSigners()

        const hardhatHelloWorld = await ethers.deployContract("HelloWorld")
        await hardhatHelloWorld.waitForDeployment()

        const msg = await hardhatHelloWorld.getMessage()
        expect(msg).to.eq("Hello World")
    });
})