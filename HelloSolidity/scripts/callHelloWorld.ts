import * as dotenv from "dotenv"
import {ethers} from "ethers";
import helloWorldArtifact from "../artifacts/contracts/HelloWorld.sol/HelloWorld.json"

dotenv.config()

async function main(address: string) {
    const rpcUrl: string = process.env.SEPOLIA_API_URL ?? ""
    if (rpcUrl === "") {
        throw new Error("No value SEPOLIA_API_URL")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(address, helloWorldArtifact.abi, provider)

    const message = await contract.getMessage()
    console.log(message)
}

const address = "0xB0745f25d411a13C10616281e4042C996E3b9501"
main(address).catch((err) => {
    console.error(err);
    process.exitCode = 1
})
