import { ethers, run } from "hardhat";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {

    // ENVIRONMENT SETUPS
    const chainId = process.env.CHAIN_ID;
    const networkRpc = process.env.NETWORK_RPC;
    const contractName = process.env.CONTRACT_NAME;
    const blockExplorerUrl = process.env.BLOCK_EXPLORER_URL;

    console.log("START DEPLOYING SMART CONTRACT")
    console.log("===Network Details===");
    console.log("Network RPC:", networkRpc);
    console.log("Chain ID:", chainId);
    console.log("=====================")

    const provider = new ethers.JsonRpcProvider(networkRpc);
    const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

    // DEPLOYING PART
    const Contract = await ethers.getContractFactory(`${contractName}`, wallet);
    const contract = await Contract.deploy();
    const address = contract.target;
    console.log("Deployed Smart Contract Address:", address);
    console.log("THIS SCRIPT WILL WAIT FOR 60 SECONDS IN ORDER FOR BLOCKCHAIN STATE TO BE CHANGED BEFORE VERIFYING")
  
    // VERIFYING PART
    await new Promise(r => setTimeout(r, 60000));
    try {
        console.log("TRY VERIFYING CONTRACT USING HARDHAT");
        await run("verify:verify", {
            address: address,
            constructorArguments: [],
            });
        console.log("=====================")
        console.log(`CONTRACT: ${address} IS VERIFIED ON ETHERSCAN/BLOCK EXPLORER`);
        console.log(`${blockExplorerUrl}/address/${address}`)
    } catch (error: any) {
        console.error("HARDHAT VERIFY FAILED WITH ERROR:", error.message);
        try {
            console.log("TRY VERIFYING CONTRACT USING COMMAND LINE");
            const verifyCommand = `npx hardhat verify --network ${networkRpc} ${address}`;
            execSync(verifyCommand, { stdio: 'inherit' });
            console.log("=====================")
            console.log(`CONTRACT: ${address} IS VERIFIED ON ETHERSCAN/BLOCK EXPLORER`);
            console.log(`${blockExplorerUrl}/address/${address}`)
        } catch (errorTwo: any) {
            console.error("COMMAND LINE VERIFY FAILED WITH ERROR:", errorTwo.message);
        }
    }

    // JSON FILE
    let jsonFile = {
        deployedContractAddress: address,
    }

    const jsonString = JSON.stringify(jsonFile, null, 2);
    fs.writeFileSync('../copyhere.json', jsonString, 'utf-8');

    // SUMMARY
    console.log("=====================\n")
    console.log("SUMMARY")

    console.log("DEPLOYMENT AND VERIFICATION ARE FINISHED")
    console.log("MAKE SURE TO COPY THE DEPLOYED SMART CONTRACT ADDRESS TO .env FILE\n")
    console.log("# DAPP CONFIG")
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`)
    console.log("NEXT_PUBLIC_FUNCTION_CALL=function write(string _input) # CHANGE TO YOUR OWN FUNCTION")
    console.log("\nDON'T FORGET TO CHANGE THE FUNCTION CALL ^^^^^^")
    console.log("=====================")
    console.log("If you accidentally clear the terminal, the deployed contract address is in copyhere.json file")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
