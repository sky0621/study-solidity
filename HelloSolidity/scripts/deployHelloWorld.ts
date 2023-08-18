import * as dotenv from "dotenv"
import {ethers} from "ethers";
import helloWorldArtifact from "../artifacts/contracts/HelloWorld.sol/HelloWorld.json"

dotenv.config()

async function main() {
    const privateKey: string = process.env.METAMASK_PRIVATE_KEY ?? ""
    if (privateKey === "") {
        throw new Error("No value METAMASK_PRIVATE_KEY")
    }

    const address: string = process.env.METAMASK_ADDRESS ?? ""
    if (address === "") {
        throw new Error("No value METAMASK_ADDRESS")
    }

    const rpcUrl: string = process.env.SEPOLIA_API_URL ?? ""
    if (rpcUrl === "") {
        throw new Error("No value SEPOLIA_API_URL")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const balance = await provider.getBalance(address)
    console.log("balance: ", balance)

    const signer = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(helloWorldArtifact.abi, helloWorldArtifact.bytecode, signer)
    const contract = await factory.deploy()
    console.log(`HelloWorld contract deploy address ${await contract.getAddress()}`)
    console.log(`Transaction URL: https://sepolia.etherscan.io/tx/${contract.deploymentTransaction()?.hash}`)
    await contract.waitForDeployment()
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1
})
