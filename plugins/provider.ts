import { ethers, providers, Contract } from "ethers";
import CryptoZombiesABI from "@/assets/json/CryptoZombiesABI.json";

declare let window: any;

export const provider = (typeof window !== 'undefined' && window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : new ethers.providers.AlchemyProvider("rinkeby", process.env.ALCHEMY_API_KEY);

export const getCryptoZombiesContract = (signer: providers.JsonRpcSigner | providers.AlchemyProvider | providers.Web3Provider) => new Contract(process.env.CONTRACT_ADDRESS!, CryptoZombiesABI, signer)
