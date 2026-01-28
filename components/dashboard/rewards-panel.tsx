"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CheckCircle, AlertCircle } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"

export function RewardsPanel() {
  const [isClaimingReferral, setIsClaimingReferral] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })
  
  const { userStats, loading, claimReferralRewards } = useContractData()
  const { address } = useWallet()

  const handleClaimReferralReward = async () => {
    if (!address || !claimReferralRewards) return

    setIsClaimingReferral(true)
    setStatus({ type: "idle", message: "" })

    try {
      await claimReferralRewards()
      setStatus({ type: "success", message: "Referral reward claimed successfully!" })
    } catch (error) {
      console.error("Failed to claim referral reward:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim reward" })
    } finally {
      setIsClaimingReferral(false)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Award className="text-accent" size={24} />
            </div>
            Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading rewards...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const referralReward = userStats?.referralReward || 0

  return (
    <Card className="glass-card border border-accent/30 hover:border-accent/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Award className="text-accent" size={24} />
          </div>
          Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Reward */}
        <div className="glass-card rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-muted-foreground">Referral Reward</div>
              <div className="text-2xl font-bold text-purple-500">
                ${referralReward.toFixed(2)} USDT
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Earned from your referrals
              </p>
            </div>
            <Award className="text-purple-500" size={32} />
          </div>
          <Button
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-500 border border-purple-500/50 py-5 rounded-xl"
            onClick={handleClaimReferralReward}
            disabled={referralReward <= 0 || isClaimingReferral}
          >
            {isClaimingReferral ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                Claiming...
              </span>
            ) : referralReward <= 0 ? (
              "No Referral Rewards"
            ) : (
              `Claim $${referralReward.toFixed(2)} Reward`
            )}
          </Button>
        </div>

        {/* Status Message */}
        {status.type !== "idle" && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg ${
              status.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
