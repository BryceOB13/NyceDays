import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Nyce Days'
  const subtitle = searchParams.get('subtitle') || 'Have A Nyce Day!'
  const type = searchParams.get('type') || 'default' // default, event, project

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          position: 'relative',
        }}
      >
        {/* Gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 30%, #1a1a1a 0%, #0A0A0A 60%)',
          }}
        />

        {/* Scanlines effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: 28,
              color: '#F5F0E8',
              marginBottom: 32,
              letterSpacing: '0.15em',
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#C94A4A' }}>★</span>
            <span>NYCE DAYS</span>
            <span style={{ color: '#C94A4A' }}>★</span>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 30 ? 52 : 64,
              fontWeight: 700,
              color: '#F5F0E8',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: type === 'event' ? '#C94A4A' : '#888888',
              marginTop: 24,
              letterSpacing: '0.05em',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* REC indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 16,
            color: '#444',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#C94A4A',
              borderRadius: '50%',
            }}
          />
          <span>REC</span>
        </div>

        {/* Timestamp */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 50,
            fontSize: 14,
            color: '#444',
            fontFamily: 'monospace',
          }}
        >
          nycedays.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
