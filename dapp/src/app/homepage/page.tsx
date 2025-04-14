'use client'
import { ethers } from "ethers";
import { useState } from "react";

export default function HomePage() {
    const functionCall = process.env.NEXT_PUBLIC_FUNCTION_CALL
    const deployedContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    
    const [isConnected, setIsConnected] = useState(false);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [transactionAttempted, setTransactionAttempted] = useState(false);
    const [chainId, setChainId] = useState<bigint | null>(null);

    const freeButtonFunction = async () => {
        console.log("free button clicked")
        console.log(process.env.NEXT_PUBLIC_FUNCTION_CALL)
        console.log(functionName)
        console.log(chainId)
    }

    const connectWallet = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const chainId = await provider.getNetwork();
        setChainId(chainId.chainId);
        setIsConnected(true);
        setSigner(signer);
        setWalletAddress(signerAddress);
    }

    const disconnectWallet = async () => {
        setIsConnected(false);
        setSigner(null);
        setWalletAddress(null);
        setChainId(null);
    }

    const functionInterface = new ethers.Interface([
        `${functionCall}`
    ]);
    
    const functionNameRaw = functionCall?.match(/function (\w+)\s*\(/);
    const functionName: any = functionNameRaw?.[1]
    
    const payload = "testing submitting transaction"
    const txPayload = functionInterface.encodeFunctionData(functionName, [payload]);


    const makeTransaction = async () => {
        setTransactionAttempted(true);
        if (!signer) {
            console.log("No signer found");
            return;
        }
        const tx = await signer.sendTransaction({
            to: deployedContractAddress,
            data: txPayload
        });
        const transactionHash = await tx.wait();
        setTransactionHash(transactionHash?.hash || null);
    }
    
    return (
        <div>
            <h1>dApp template</h1>

            <br/>

            <h1>
                Wallet: {isConnected ? walletAddress : "Not Connected"}
            </h1>

            <br/>

            <h1>
                Chain ID: {chainId ? chainId : "Not Connected"}
            </h1>

            <br/>

            <h3>Free button is made for console logging some parameters out</h3>
            <button onClick={freeButtonFunction}>Free Button</button>

            <br/>
            <br/>

            <button onClick={isConnected ? disconnectWallet : connectWallet}>
                {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
            </button>

            <br/>
            <br/>

            <button onClick={makeTransaction}>Make Transaction</button>

            {transactionAttempted && (
                <h1>
                    Transaction Hash: {transactionHash ? transactionHash : "Making Transaction..."}
                </h1>
            )}
        </div>
    )
}
