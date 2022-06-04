import { ethers, providers, Contract } from 'ethers'
import { serializeError } from 'eth-rpc-errors'
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
    error = serializeError(error)
    if (error?.data?.originalError?.error?.message) {
        return error.data.originalError.error.message
    } else if (error?.message) {
        return error.message
    }
    return message
}