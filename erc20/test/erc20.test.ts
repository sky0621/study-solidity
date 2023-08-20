import {ethers} from "hardhat";
import {expect} from "chai"
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"

async function deployContractsFixture() {
    const [account0, account1, account2] = await ethers.getSigners();
    const ERC20 = await ethers.getContractFactory("ERC20", account0);
    const erc20 = await ERC20.deploy("Zenny", "ZNY", 18);
    await erc20.waitForDeployment()
    return {erc20, account0, account1, account2}
}

async function deployMintContractsFixture() {
    const [account0, account1, account2] = await ethers.getSigners();
    const ERC20 = await ethers.getContractFactory("ERC20", account0);
    const erc20 = await ERC20.deploy("Zenny", "ZNY", 18);
    await erc20.waitForDeployment()

    const balance1: bigint = 10n * (10n ** 18n);
    const tx = await erc20.mint(account1.address, balance1)
    await tx.wait();

    return {erc20, account0, account1, account2, balance1}
}

describe("ERC20 contract states", function () {
    it("getters", async function () {
        const {erc20} = await loadFixture(deployContractsFixture)

        expect(await erc20.name()).to.equal("Zenny")
        expect(await erc20.symbol()).to.equal("ZNY")
        expect(await erc20.decimals()).to.equal(18)
        expect(await erc20.totalSupply()).to.equal(0)
    })
})

describe("ERC20 mint", function () {
    it("mint", async function () {
        const {erc20, account0, account1, account2} = await loadFixture(deployContractsFixture)

        expect(await erc20.balanceOf(account0.address)).to.equal(0)
        expect(await erc20.balanceOf(account1.address)).to.equal(0)
        expect(await erc20.balanceOf(account2.address)).to.equal(0)

        const decimals = await erc20.decimals();

        const amount1: bigint = 10n * (10n ** decimals)
        const tx1 = await erc20.mint(account1.address, amount1)
        const receipt1 = await tx1.wait();

        expect(await erc20.balanceOf(account0.address)).to.equal(0)
        expect(await erc20.balanceOf(account1.address)).to.equal(amount1)
        expect(await erc20.balanceOf(account2.address)).to.equal(0)
        expect(await erc20.totalSupply()).to.equal(amount1)

        const amount2: bigint = 10n * (10n ** decimals)
        const tx2 = await erc20.mint(account1.address, amount2)
        const receipt2 = await tx2.wait();

        expect(await erc20.balanceOf(account0.address)).to.equal(0)
        expect(await erc20.balanceOf(account1.address)).to.equal(amount1 + amount2)
        expect(await erc20.balanceOf(account2.address)).to.equal(0)
        expect(await erc20.totalSupply()).to.equal(amount1 + amount2)
    })

    it("mint from non-owner", async function () {
        const {erc20, account0, account1, account2} = await loadFixture(deployContractsFixture)
        const amount = 123;

        await expect(erc20.connect(account1).mint(account1.address, amount)).to.be.revertedWith("only contract owner can call mint")
        expect(await erc20.balanceOf(account1.address)).to.equal(0);
    })

    it("mint overflow", async function () {
        const {erc20, account0, account1, account2} = await loadFixture(deployContractsFixture)
        const uint256Max: bigint = 2n ** 256n - 1n;

        await erc20.mint(account1.address, uint256Max)
        await expect(erc20.mint(account1.address, 1)).to.be.revertedWithPanic(0x11)
    })
})

describe("ERC20 transfer", function () {
    it("transfer and Transfer event", async function () {
        const {erc20, account0, account1, account2, balance1} = await loadFixture(deployMintContractsFixture)
        const decimals = await erc20.decimals()
        const amount: bigint = 7n * (10n ** decimals)
        await expect(erc20.connect(account1).transfer(account2.address, amount))
            .to.emit(erc20, "Transfer").withArgs(account1.address, account2.address, amount)

        expect(await erc20.balanceOf(account1.address)).to.equal(balance1 - amount)
        expect(await erc20.balanceOf(account2.address)).to.equal(amount)
    })
})

