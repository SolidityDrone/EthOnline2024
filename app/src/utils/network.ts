
import { Chain, sepolia } from 'viem/chains'

let chains: [Chain] = [sepolia]


export const ETH_CHAINS = chains

export const NETWORK_COLORS = {
}

export function GetNetworkColor(chain?: string, type: 'color' | 'bgVariant' = 'color') {
  chain = chain?.toLowerCase()

  return 'black'
}