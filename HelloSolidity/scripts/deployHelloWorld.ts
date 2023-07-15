import { ethers} from "ethers";

const main = async ()=>{
    console.log("PRIVATE_KEY: ",process.env.PRIVATE_KEY)
    console.log("SEPOLIA_URL: ",process.env.SEPOLIA_URL)
}

main().catch((e)=>{
    console.error(e)
    process.exitCode=1
})
