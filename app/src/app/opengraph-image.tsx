
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw='flex flex-col items-center justify-center w-full h-full text-white'
        style={{
          background: 'linear-gradient(to right bottom, rgb(17, 24, 39), rgb(75, 85, 99))',
        }}>
        <h1 tw='text-8xl'>
          Stacks | Stackr
        </h1>
      </div>
    )
  )
}
