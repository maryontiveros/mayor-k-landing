import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'mayork. | Ferretería al Mayor'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), 'public/mayork-lockup.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <img src={logoSrc} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} alt="" />
      </div>
    ),
    { ...size }
  )
}
