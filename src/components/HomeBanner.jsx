import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const assets = import.meta.glob(
  '../assets/v2/banners/*.webp',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

const photos = [
  'angkor.webp',
  'sihanoukville.webp',
  'phnom-penh.webp'
]

const banners = {
  zh: [
    ['美好生活，一站搞定', '外卖 · 购物 · 充值 · 配送'],
    ['发现身边的美好', '探索西港，畅享便捷生活'],
    ['连接每一份美好', '让柬埔寨生活更简单']
  ],
  en: [
    ['Everything in one place', 'Food · Shopping · Top-up'],
    ['Discover local life', 'Explore Sihanoukville'],
    ['Connected by CAM LIFE', 'Making everyday life easier']
  ],
  km: [
    ['សេវាកម្មនៅកន្លែងតែមួយ', 'អាហារ · ទិញទំនិញ · ដឹកជញ្ជូន'],
    ['ស្វែងរកអ្វីល្អៗ', 'ជីវិតនៅព្រះសីហនុ'],
    ['ជីវិតកាន់តែងាយស្រួល', 'រស់នៅជាមួយ CAM LIFE']
  ]
}

export default function HomeBanner({ lang = 'zh' }) {
  const [active, setActive] = useState(0)
  const touchStart = useRef(null)
  const slides = banners[lang] || banners.zh

  function move(step) {
    setActive(i => (i + step + slides.length) % slides.length)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => {
      setActive(i => (i + 1) % slides.length)
    }, 5000)

    return () => clearTimeout(timer)
  }, [active, slides.length])

  function handleTouchEnd(e) {
    if (touchStart.current === null) return

    const distance =
      touchStart.current - e.changedTouches[0].clientX

    if (Math.abs(distance) > 45) {
      move(distance > 0 ? 1 : -1)
    }

    touchStart.current = null
  }

  return (
    <section
      className={'v2-banner v2-banner-' + active}
      onTouchStart={e => {
        touchStart.current = e.touches[0].clientX
      }}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null
      }}
      style={{ touchAction: 'pan-y' }}
    >

      {photos.map((photo, index) => {
        const image =
          assets['../assets/v2/banners/' + photo]

        return image ? (
          <img
            key={photo}
            src={image}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: active === index ? 1 : 0,
              transition: 'opacity 600ms ease',
              zIndex: -2,
              pointerEvents: 'none'
            }}
          />
        ) : null
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background:
            'linear-gradient(90deg, rgba(3,40,29,.88), rgba(3,40,29,.38) 65%, rgba(3,40,29,.12))',
          pointerEvents: 'none'
        }}
      />

      <div className="v2-banner-content">
        <small>CAM LIFE · CAMBODIA</small>
        <h1>{slides[active][0]}</h1>
        <p>{slides[active][1]}</p>
      </div>

      <div className="v2-banner-controls">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={16}/>
        </button>

        <div className="v2-banner-dots">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              aria-label={'Banner ' + (i + 1)}
              aria-pressed={active === i}
              className={active === i ? 'active' : ''}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => move(1)}
        >
          <ChevronRight size={16}/>
        </button>
      </div>
    </section>
  )
}
