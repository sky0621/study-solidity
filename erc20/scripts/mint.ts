import {Option, program} from "commander"
import * as dotenv from "dotenv"
import {ethers} from "ethers";
import erc20Artifacts from "../artifacts/contracts/erc20.sol/ERC20.json"

dotenv.config()

function getRpcUrl(network: string): string {
    if (network == "polygon") {
        return process.env.POLYGON_API_URL ?? "";
    } else if (network == "sepolia") {
        return process.env.SEPOLIA_API_URL ?? "";
    } else {
        return "";
    }
}

function transactionExploreUrl(network: string, txHash: string): string {
    if (network == "polygon") {
        return `https://polygonscan.com/tx/${txHash}`
    } else if (network == "sepolia") {
        return `https://sepolia.etherscan.io/tx/${txHash}`
    } else {
        return "";
    }
}

async function main(network: string, contractAddress: string, accountAddress: string, amount: number) {
    console.log("network: ", network)
    console.log("contractAddress: ", contractAddress)
    console.log("accountAddress: ", accountAddress)
    console.log("amount: ", amount)

    const privateKey: string = process.env.METAMASK_PRIVATE_KEY ?? ""
    if (privateKey === "") {
        throw new Error("No value METAMASK_PRIVATE_KEY")
    }

    const rpcUrl: string = getRpcUrl(network)
    if (rpcUrl === "") {
        throw new Error("No value API_URL")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const signer = new ethers.Wallet(privateKey, provider)

    const contract = new ethers.Contract(contractAddress, erc20Artifacts.abi, signer)
    const decimals: bigint = await contract.decimals();
    console.log("decimals: ", decimals)
    const rawAmount: bigint = BigInt(BigInt(Math.floor(amount)) * (10n ** decimals))
    console.log("rawAmount: ", rawAmount)
    const tx = await contract.mint(accountAddress, rawAmount)
    console.log(`Transaction URL: ${transactionExploreUrl(network, tx.hash)}`)

    const receipt = await tx.wait();
    for (let log of receipt.logs) {
        try {
            const event = contract.interface.parseLog(log)
            if (!event) {
                console.error("event is none")
                continue
            }
            console.log(`Event Name: ${event.name}`)
            console.log(`Event Args: ${event.args}`)
        } catch (e) {
            console.error(e)
        }
    }
}

program
    .addOption(
        new Option(
            '--network <string>', 'name of blockchain network(e.g. polygon, sepolia)')
            .choices(['polygon', 'sepolia']).makeOptionMandatory())
    .addOption(
        new Option(
            '--contractAddress <address>', 'address of token contract')
            .makeOptionMandatory())
    .addOption(
        new Option(
            '--accountAddress <address>', 'mint token to this account address')
            .makeOptionMandatory())
    .addOption(
        new Option(
            '--amount <number>', 'amount of token minted (e.g. 1.23)')
            .argParser(parseFloat).makeOptionMandatory())
    .parse()
const options = program.opts()

main(options.network, options.contractAddress, options.accountAddress, options.amount).catch((err) => {
    console.error(err);
    process.exitCode = 1
})
