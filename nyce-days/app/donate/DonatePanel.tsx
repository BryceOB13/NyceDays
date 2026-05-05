'use client'

import { useState } from 'react'

const PRESETS = [25, 50, 100, 250]

export default function DonatePanel({ totalCents }: { totalCents: number }) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveDollars = customAmount ? parseFloat(customAmount) : (selectedPreset ?? 0)
  const effectiveCents = Math.round(effectiveDollars * 100)
  const isValid = effectiveCents >= 100 && effectiveCents <= 1_000_000

  const handlePreset = (amount: number) => {
    setSelectedPreset(amount)
    setCustomAmount('')
    setError(null)
  }

  const handleCustom = (value: string) => {
    setCustomAmount(value)
    setSelectedPreset(null)
    setError(null)
  }

  const handleDonate = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveCents }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'something went wrong')
        setLoading(false)
      }
    } catch {
      setError('network error. try again.')
      setLoading(false)
    }
  }

  const totalFormatted = totalCents > 0
    ? `$${Math.floor(totalCents / 100).toLocaleString()} raised so far`
    : null

  return (
    <div className="w-full max-w-[480px]">
      {/* Glass card on desktop */}
      <div className="md:bg-[rgba(232,228,221,0.06)] md:backdrop-blur-[12px] md:border md:border-[rgba(232,228,221,0.12)] md:rounded-lg md:p-8">
        {/* Kicker */}
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#E8E4DD]/80 font-medium">
          nyce days · the yard · cookout fund
        </p>

        {/* Headline */}
        <h1 className="font-serif text-3xl md:text-4xl text-[#E8E4DD] mt-2 leading-tight">
          jamaica hurricane relief
        </h1>

        {/* Body */}
        <p className="text-sm text-[#E8E4DD]/80 mt-4 leading-relaxed">
          melissa hit hard. the cookout on may 24 is one way we show up. this is the other. 100% of what you give here gets forwarded to supportjamaica.gov.jm. nyce days takes nothing.
        </p>

        {/* Running total */}
        {totalFormatted && (
          <p className="text-xs text-[#E8E4DD]/60 mt-3 font-medium">
            {totalFormatted}
          </p>
        )}

        {/* Preset chips */}
        <div className="flex gap-2 mt-6">
          {PRESETS.map(amount => (
            <button
              key={amount}
              onClick={() => handlePreset(amount)}
              className={`flex-1 h-11 rounded-md text-sm font-medium transition-all ${
                selectedPreset === amount
                  ? 'bg-[#E8E4DD] text-[#0A0A0A]'
                  : 'border border-[#E8E4DD]/30 text-[#E8E4DD] hover:border-[#E8E4DD]/60'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mt-3">
          <input
            type="number"
            inputMode="decimal"
            placeholder="other amount"
            value={customAmount}
            onChange={e => handleCustom(e.target.value)}
            className="w-full bg-transparent border-b border-[#E8E4DD]/30 text-[#E8E4DD] placeholder:text-[#E8E4DD]/40 py-3 text-sm focus:outline-none focus:border-[#E8E4DD]/60 transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-[#D64545] mt-2">{error}</p>
        )}

        {/* Donate button */}
        <button
          onClick={handleDonate}
          disabled={!isValid || loading}
          className="w-full md:w-[280px] h-12 mt-6 bg-[#D64545] text-[#E8E4DD] rounded-md text-sm font-medium transition-all hover:bg-[#D64545]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'redirecting...' : `donate $${effectiveDollars}`}
        </button>

        {/* Fine print */}
        <p className="text-[10px] text-[#E8E4DD]/50 mt-4 leading-relaxed max-w-sm">
          not tax-deductible. nyce days isn&apos;t a registered nonprofit. stripe processing fees apply. funds are wired in bulk to supportjamaica.gov.jm and we&apos;ll post the receipt to @nycedays.
        </p>
      </div>
    </div>
  )
}
