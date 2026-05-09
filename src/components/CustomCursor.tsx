import { useEffect, useRef } from 'react'

/**
 * CustomCursor — gold ring + dot cursor from food-chronicles1.
 * Rendered only on hover-capable (desktop) devices via CSS.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot    = dotRef.current
    if (!cursor || !dot) return

    let mouseX = -100, mouseY = -100
    let curX   = -100, curY   = -100

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const onEnter = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest('a, button, [role="button"], .article-card')) {
        cursor.classList.add('is-hover')
      } else if (t.closest('input, textarea')) {
        cursor.classList.add('is-text')
      }
    }

    const onLeave = () => {
      cursor.classList.remove('is-hover', 'is-text')
    }

    const onDocLeave = () => {
      cursor.style.opacity = '0'
      dot.style.opacity    = '0'
    }
    const onDocEnter = () => {
      cursor.style.opacity = '1'
      dot.style.opacity    = '1'
    }

    let raf: number
    const animate = () => {
      curX += (mouseX - curX) * 0.12
      curY += (mouseY - curY) * 0.12
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseover',  onEnter)
    document.addEventListener('mouseout',   onLeave)
    document.addEventListener('mouseleave', onDocLeave)
    document.addEventListener('mouseenter', onDocEnter)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseover',  onEnter)
      document.removeEventListener('mouseout',   onLeave)
      document.removeEventListener('mouseleave', onDocLeave)
      document.removeEventListener('mouseenter', onDocEnter)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="tfc-cursor" />
      <div ref={dotRef}    className="tfc-cursor-dot" />
    </>
  )
}
