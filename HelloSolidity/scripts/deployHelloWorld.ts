import {ethers} from "hardhat";

const main = async () => {
    const [deployer] = await ethers.getSigners()
    console.log("account: ", deployer.address)

    const helloWorld = await ethers.deployContract("HelloWorld")
    console.log("address: ", await helloWorld.getAddress())
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exitCode = 1
    })
