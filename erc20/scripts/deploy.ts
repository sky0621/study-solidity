import {ethers} from "ethers";
import erc20Artifacts from "../artifacts/contracts/erc20.sol/ERC20.json"
import {Option, program} from "commander"
import * as dotenv from "dotenv"

dotenv.config()

async function main(name: string, symbol: string, decimals: number) {
    console.log("name: ", name)
    console.log("symbol: ", symbol)
    console.log("decimals: ", decimals)

    const privateKey: string = process.env.METAMASK_PRIVATE_KEY ?? ""
    if (privateKey === "") {
        throw new Error("No value METAMASK_PRIVATE_KEY")
    }

    const rpcUrl: string = process.env.SEPOLIA_API_URL ?? ""
    if (rpcUrl === "") {
        throw new Error("No value SEPOLIA_API_URL")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const signer = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(erc20Artifacts.abi, erc20Artifacts.bytecode, signer)
    const contract = await factory.deploy(name, symbol, decimals)
    await contract.waitForDeployment()
    console.log(`ERC20 contract deploy address ${await contract.getAddress()}`)
    console.log(`Transaction URL: https://sepolia.etherscan.io/tx/${contract.deploymentTransaction()?.hash}`)
    console.log("Deploy completed")
}

program
    .addOption(new Option('--name <string>', 'name of token (e.g. bitcoin)').makeOptionMandatory())
    .addOption(new Option('--symbol <string>', 'symbol of token (e.g. BTC)').makeOptionMandatory())
    .addOption(new Option('--decimals <number>', 'decimals of token (e.g. 18)').argParser(parseInt).makeOptionMandatory())
    .parse()
const options = program.opts()

main(options.name, options.symbol, options.decimals).catch((err) => {
    console.error(err);
    process.exitCode = 1
})
