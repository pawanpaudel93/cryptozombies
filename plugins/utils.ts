import { ethers, providers, Contract } from 'ethers'
import Vue from 'vue';
import CryptoZombiesABI from '@/assets/json/CryptoZombiesABI.json'

declare let window: any
type SignerOrProvider = providers.JsonRpcSigner | providers.AlchemyProvider | providers.Web3Provider;

export const getProvider = (signer = false) => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && signer) {
        return new ethers.providers.Web3Provider(window.ethereum)
    }
    return new ethers.providers.AlchemyProvider(
        'rinkeby',
        process.env.ALCHEMY_API_KEY
    )
}

export const getCryptoZombiesContract = (
    signerOrProvider: SignerOrProvider
) =>
    new Contract(
        process.env.CONTRACT_ADDRESS!,
        CryptoZombiesABI,
        signerOrProvider
    )

export const errorToast = (error: any, message: string) => {
    if (error?.data?.message) {
        Vue.$toast.error(error.data.message)
    } else if (error?.message) {
        Vue.$toast.error(error.message)
    } else {
        Vue.$toast.error(message)
    }
}