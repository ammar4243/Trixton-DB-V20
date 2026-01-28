import { ethers } from "ethers"

export const CONTRACT_ADDRESS = "0x977983a47664f10c4e5f6f0b7f0e2b2a7f46800d"

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_tinToken", type: "address" },
      { internalType: "address", name: "_usdtToken", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" },
      { internalType: "address", name: "_admin", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "TIN", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "USDT", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "adminWallet", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "claimDailyReward", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "claimMilestoneReward", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "claimReferralRewards", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getClaimableDaily", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getDirectReferrals", outputs: [{ internalType: "address[]", name: "", type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getMilestoneStatus", outputs: [{ internalType: "bool", name: "achieved", type: "bool" }, { internalType: "bool", name: "claimed", type: "bool" }, { internalType: "uint256", name: "reward", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "hasInvested", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "packageId", type: "uint256" }, { internalType: "address", name: "referrerAddr", type: "address" }], name: "invest", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "pendingReferralRewards", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "referralCount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "referralRates", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "totalInvested", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "tokenRewards", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }
]

export const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"

export const AIRDROP_CONTRACT_ADDRESS = "0xD9f0671381ed1E6415E2AE9832D9891a18C61e85"

export const AIRDROP_CONTRACT_ABI = [
  { inputs: [{ internalType: "address", name: "initialOwner", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "AIRDROP_TOKEN", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "CLAIM_AMOUNT", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "POL_FEE", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "claim", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "hasClaimed", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "tokenAddress", type: "address" }, { internalType: "uint256", name: "tokenAmount", type: "uint256" }], name: "recoverERC20", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "withdrawPolFees", outputs: [], stateMutability: "nonpayable", type: "function" }
]

export const SEED_SALE_CONTRACT_ADDRESS = "0x25865e08F63737D06f1FA4aF7026d36EC438AEcf"

export const SEED_SALE_CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "previousOwner", type: "address" }, { indexed: true, internalType: "address", name: "newOwner", type: "address" }], name: "OwnershipTransferred", type: "event" },
  { inputs: [], name: "TOKENS_PER_PACKAGE_1", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKENS_PER_PACKAGE_2", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKENS_PER_PACKAGE_3", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKENS_PER_PACKAGE_4", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "USD_PACKAGE_1", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "USD_PACKAGE_2", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "USD_PACKAGE_3", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "USD_PACKAGE_4", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "packageId", type: "uint256" }], name: "buyTokens", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "hasPurchased", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "tinToken", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalTokensSold", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalUSDTRaised", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "usdtToken", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "token", type: "address" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "withdrawTokens", outputs: [], stateMutability: "nonpayable", type: "function" }
]

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      return { provider, signer, address }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  } else {
    throw new Error("MetaMask is not installed")
  }
}

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

export function getUsdtContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  const USDT_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)"
  ]
  return new ethers.Contract(USDT_ADDRESS, USDT_ABI, signerOrProvider)
}

export function getAirdropContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_CONTRACT_ABI, signerOrProvider)
}
