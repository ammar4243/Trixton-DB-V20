"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Gift, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { getAirdropContract } from "@/lib/web3"

export function TokenPurchase() {
  // Airdrop state
  const [airdropLoading, setAirdropLoading] = useState(false)
  const [airdropClaimed, setAirdropClaimed] = useState(false)
  const [airdropAlreadyClaimed, setAirdropAlreadyClaimed] = useState(false)
  const [airdropChecking, setAirdropChecking] = useState(true)
  const [airdropError, setAirdropError] = useState("")
  const [airdropTxHash, setAirdropTxHash] = useState("")

  const { address, provider, isConnected } = useWallet()

  // Check airdrop claim status
  const checkAirdropStatus = async () => {
    if (!provider || !address) {
      setAirdropChecking(false)
      return
    }
    try {
      const signer = await provider.getSigner()
      const contract = getAirdropContract(signer)
      const hasClaimedAlready = await contract.hasClaimed(address)
      setAirdropAlreadyClaimed(hasClaimedAlready)
    } catch (err) {
      console.error("Error checking airdrop status:", err)
    } finally {
      setAirdropChecking(false)
    }
  }

  const handleAirdropClaim = async () => {
    if (!provider || !address) {
      setAirdropError("Please connect your wallet first")
      return
    }

    setAirdropLoading(true)
    setAirdropError("")
    setAirdropClaimed(false)
    setAirdropTxHash("")

    try {
      const signer = await provider.getSigner()
      const contract = getAirdropContract(signer)

      const hasClaimedAlready = await contract.hasClaimed(address)
      if (hasClaimedAlready) {
        setAirdropError("You have already claimed your airdrop!")
        setAirdropAlreadyClaimed(true)
        setAirdropLoading(false)
        return
      }

      const polFee = await contract.POL_FEE()
      const tx = await contract.claim({ value: polFee })
      setAirdropTxHash(tx.hash)

      await tx.wait()
      setAirdropClaimed(true)
      setAirdropAlreadyClaimed(true)
    } catch (err: any) {
      console.error("Airdrop claim error:", err)
      if (err.reason) {
        setAirdropError(err.reason)
      } else if (err.message?.includes("already claimed")) {
        setAirdropError("You have already claimed your airdrop!")
        setAirdropAlreadyClaimed(true)
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setAirdropError("Insufficient POL for claim fee")
      } else {
        setAirdropError(err.message || "Failed to claim airdrop. Please try again.")
      }
    } finally {
      setAirdropLoading(false)
    }
  }

  useEffect(() => {
    if (address && provider) {
      checkAirdropStatus()
    }
  }, [address, provider])

  return (
    <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Gift className="text-primary" size={24} />
          </div>
          <span>Claim <span className="text-primary neon-text">Airdrop</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Airdrop Claim Section */}
        <div className="glass-card rounded-xl p-6 border border-primary/30 neon-border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
              <Gift size={20} className="text-primary" />
              <span className="font-bold text-primary">Free Airdrop</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">2,000 TIN</div>
            <p className="text-muted-foreground">Free tokens for early supporters</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-muted/20">
              <span className="text-muted-foreground">Token Amount</span>
              <span className="font-bold text-primary">2,000 TIN</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muted/20">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium">Polygon</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Claim Fee</span>
              <span className="font-medium text-accent">Small POL gas fee</span>
            </div>
          </div>
        </div>

        {airdropClaimed && (
          <Alert className="border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              <div className="flex flex-col gap-2">
                <span>You have successfully claimed 2,000 TIN tokens!</span>
                {airdropTxHash && (
                  <a
                    href={`https://polygonscan.com/tx/${airdropTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {airdropError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{airdropError}</AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAirdropClaim}
          disabled={airdropLoading || airdropAlreadyClaimed || airdropClaimed || !isConnected || airdropChecking}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-lg py-6 rounded-xl neon-border animate-pulse-glow"
        >
          {!isConnected ? (
            <span>Connect Wallet First</span>
          ) : airdropChecking ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking Status...
            </span>
          ) : airdropLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Claiming...
            </span>
          ) : airdropAlreadyClaimed || airdropClaimed ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Already Claimed
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Claim 2,000 TIN Tokens
            </span>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Each wallet can only claim once. Requires small POL fee for gas.
        </p>
      </CardContent>
    </Card>
  )
}
