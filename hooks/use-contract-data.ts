"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"
import { ethers } from "ethers"

// Level achievement thresholds (direct referrals needed)
export const LEVEL_THRESHOLDS = [
  { level: 1, referrals: 1 },
  { level: 2, referrals: 2 },
  { level: 3, referrals: 3 },
  { level: 4, referrals: 4 },
  { level: 5, referrals: 5 },
  { level: 6, referrals: 6 },
  { level: 7, referrals: 7 },
  { level: 8, referrals: 8 },
  { level: 9, referrals: 9 },
  { level: 10, referrals: 10, name: "Handshake" },
]

// Level rewards in USDT (as per requirements)
// Level 4: $50, Level 5: $100, Level 6: $250, Level 7: $500, Level 8: $1000, Level 9: $2000, Golden Handshake: $3000
export const LEVEL_REWARDS = [
  { level: 4, reward: 50, label: "Level 4" },
  { level: 5, reward: 100, label: "Level 5" },
  { level: 6, reward: 250, label: "Level 6" },
  { level: 7, reward: 500, label: "Level 7" },
  { level: 8, reward: 1000, label: "Level 8" },
  { level: 9, reward: 2000, label: "Level 9" },
  { level: 10, reward: 3000, label: "Golden Handshake" },
]

interface UserStats {
  totalInvestment: number
  tinBalance: number
  userLevel: number
  totalReferrals: number
  referralEarnings: number
  pendingReferralRewards: number
  globalPoolReward: number
  hasInvested: boolean
  dailyReward: number
  referralReward: number
}

interface ReferralData {
  directReferrals: string[]
  totalReferrals: number
  pendingRewards: number
  referralCount: number
}

interface LevelRewardStatus {
  level: number
  reward: number
  achieved: boolean
  claimed: boolean
}

interface PresaleData {
  tokenPrice: number
  investmentAmount: number
  globalPool: number
}

export function useContractData() {
  const { contract, address, isConnected, isReady, signer } = useWallet()
  const [presaleData, setPresaleData] = useState<PresaleData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [levelRewards, setLevelRewards] = useState<LevelRewardStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [gcmBalance, setGcmBalance] = useState<number>(0); // Declare gcmBalance variable
  const [dailyReward, setDailyReward] = useState<number>(0); // Declare dailyReward variable
  const [hasInvested, setHasInvested] = useState<boolean>(false); // Declare hasInvested variable
  const [referralReward, setReferralReward] = useState<number>(0); // Declare referralReward variable

  const fetchContractData = useCallback(async () => {
    if (!isConnected || !contract || !address) {
      setUserStats({
        totalInvestment: 0,
        tinBalance: 0,
        userLevel: 0,
        totalReferrals: 0,
        referralEarnings: 0,
        pendingReferralRewards: 0,
        globalPoolReward: 0,
        hasInvested: false,
        dailyReward: 0,
        referralReward: 0,
      })
      setReferralData({
        directReferrals: [],
        totalReferrals: 0,
        pendingRewards: 0,
        referralCount: 0,
      })
      setLevelRewards([])
      return
    }

    setLoading(true)
    try {
      // Fetch token price (default 0.4 USDT = 1 GCM)
      let tokenPrice = 0.4
      try {
        const price = await contract.gcmPriceInUSDT()
        tokenPrice = Number(ethers.formatUnits(price, 6))
        console.log("[v0] Token price from contract:", tokenPrice)
      } catch (error) {
        console.log("[v0] Using default token price 0.4 USDT")
      }

      // Fetch investment amount (100 USDT)
      let investmentAmount = 100
      try {
        const amount = await contract.INVESTMENT_AMOUNT()
        investmentAmount = Number(ethers.formatUnits(amount, 6))
      } catch (error) {
        console.log("Using default investment amount")
      }

      // Fetch global pool
      let globalPool = 0
      try {
        const pool = await contract.globalPool()
        globalPool = Number(ethers.formatUnits(pool, 6))
      } catch (error) {
        console.log("Could not fetch global pool")
      }

      setPresaleData({
        tokenPrice,
        investmentAmount,
        globalPool,
      })

      // Fetch total investment and pending daily reward using getPlanDetails
      let totalInvestment = 0
      let dailyRewardAmount = 0
      let tinBalance = 0
      try {
        // Try to fetch plan details for planId 0 (first investment plan)
        const planDetails = await contract.getPlanDetails(address, 0)
        totalInvestment = Number(ethers.formatUnits(planDetails.investmentAmount, 6)) // USDT has 6 decimals
        dailyRewardAmount = Number(ethers.formatUnits(planDetails.pendingDailyReward, 6)) // USDT has 6 decimals
        tinBalance = Number(ethers.formatEther(planDetails.tinTokens)) // TIN tokens use 18 decimals
        console.log("[v0] getPlanDetails - Investment:", totalInvestment, "Daily Reward:", dailyRewardAmount, "TIN:", tinBalance)
      } catch (error) {
        console.log("[v0] Error fetching plan details:", error)
        // Fallback to individual function calls if getPlanDetails fails
        try {
          const invested = await contract.totalInvested(address)
          totalInvestment = Number(ethers.formatUnits(invested, 6))
          console.log("[v0] totalInvestment (fallback):", totalInvestment)
        } catch (e) {
          console.log("[v0] Error fetching totalInvestment:", e)
        }

        try {
          const tokens = await contract.tokenRewards(address)
          tinBalance = Number(ethers.formatEther(tokens))
          console.log("[v0] tinBalance (fallback):", tinBalance)
        } catch (e) {
          console.log("[v0] Error fetching tinBalance:", e)
        }

        try {
          const daily = await contract.getClaimableDaily(address)
          dailyRewardAmount = Number(ethers.formatUnits(daily, 6))
          console.log("[v0] dailyReward (fallback):", dailyRewardAmount)
        } catch (e) {
          console.log("[v0] Error fetching daily reward:", e)
        }
      }

      // Fetch user level
      let userLevel = 0
      let hasInvested = false
      try {
        hasInvested = await contract.hasInvested(address)
        console.log("[v0] hasInvested:", hasInvested)
      } catch (error) {
        console.log("[v0] Error fetching hasInvested:", error)
      }

      try {
        const level = await contract.referralCount(address)
        userLevel = Number(level)
        console.log("[v0] userLevel (from referralCount):", userLevel)
      } catch (error) {
        console.log("[v0] Error fetching user level:", error)
      }

      // Fetch referral data
      let directReferrals: string[] = []
      let referralCount = 0
      let pendingRewards = 0
      try {
        // Only fetch pending referral rewards - skip getDirectReferrals
        const pending = await contract.pendingReferralRewards(address)
        pendingRewards = Number(ethers.formatUnits(pending, 6))
        console.log("[v0] referralReward:", pendingRewards)
      } catch (error) {
        console.log("[v0] Error fetching referral data:", error)
      }

      // Fetch global pool reward
      let globalPoolReward = 0
      try {
        const reward = await contract.getPendingGlobalPoolReward(address)
        globalPoolReward = Number(ethers.formatUnits(reward, 6))
        console.log("[v0] globalPoolReward:", globalPoolReward)
      } catch (error) {
        console.log("[v0] Error fetching global pool reward:", error)
      }

      // Fetch level reward statuses
      const levelRewardStatuses: LevelRewardStatus[] = []
      for (const lr of LEVEL_REWARDS) {
        try {
          const status = await contract.getLevelRewardStatus(address, lr.level)
          levelRewardStatuses.push({
            level: lr.level,
            reward: lr.reward,
            achieved: status.achieved,
            claimed: status.claimed,
          })
        } catch (error) {
          levelRewardStatuses.push({
            level: lr.level,
            reward: lr.reward,
            achieved: userLevel >= lr.level,
            claimed: false,
          })
        }
      }
      setLevelRewards(levelRewardStatuses)

      setUserStats({
        totalInvestment,
        tinBalance,
        userLevel,
        totalReferrals: 0,
        referralEarnings: pendingRewards,
        pendingReferralRewards: pendingRewards,
        globalPoolReward,
        hasInvested,
        dailyReward: dailyRewardAmount,
        referralReward: pendingRewards,
      })

      setReferralData({
        directReferrals: [],
        totalReferrals: 0,
        pendingRewards,
        referralCount: 0,
      })

      setReferralData({
        directReferrals,
        totalReferrals: referralCount,
        pendingRewards,
        referralCount,
      })

    } catch (error) {
      console.error("Error fetching contract data:", error)
    } finally {
      setLoading(false)
    }
  }, [isConnected, contract, address])

  useEffect(() => {
    fetchContractData()
  }, [fetchContractData])

  // Invest function
  const invest = async (referrerAddress: string) => {
    if (!contract || !address || !signer) {
      throw new Error("Wallet not connected")
    }

    const referrer = referrerAddress && ethers.isAddress(referrerAddress)
      ? referrerAddress
      : "0x0000000000000000000000000000000000000000"

    const tx = await contract.invest(referrer)
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim referral rewards
  const claimReferralRewards = async () => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimReferralRewards()
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim level reward
  const claimLevelReward = async (level: number) => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimLevelReward(level)
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim global pool reward
  const claimGlobalPoolReward = async () => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimFromGlobalPool()
    await tx.wait()
    await fetchContractData()
    return tx
  }

  return {
    presaleData,
    userStats,
    referralData,
    levelRewards,
    loading,
    refetch: fetchContractData,
    invest,
    claimReferralRewards,
    claimLevelReward,
    claimGlobalPoolReward,
    packages: [{ id: 1, price: 100, tokens: 1000, label: "Standard Package" }],
    gcmBalance, // Include gcmBalance in return object
    dailyReward, // Include dailyReward in return object
    referralReward, // Include referralReward in return object
  }
}
