import { ethers, providers, Contract } from "ethers";
import CryptoZombiesABI from "@/CryptoZombiesABI.json";

declare let window: any;

export const provider = (typeof window !== 'undefined' && window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : new ethers.providers.AlchemyProvider(process.env.NETWORK, process.env.ALCHEMY_API_KEY);

export const getCryptoZombiesContract = (signer?: providers.JsonRpcSigner) => signer ? new Contract(process.env.CONTRACT_ADDRESS!, CryptoZombiesABI, signer) : new Contract(process.env.CONTRACT_ADDRESS!, CryptoZombiesABI);
