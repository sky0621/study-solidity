import { ethers} from "ethers";

async function main(){
    console.log(process.env.PRIVATE_KEY)
}

main().catch((e)=>{
    console.log(e)
    process.exitCode = 1
})