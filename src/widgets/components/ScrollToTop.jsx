import React, { useState, useEffect } from 'react'

function scrollToTop (smooth) {
  if (smooth) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    document.documentElement.scrollTop = 0
  }
}

const ScrollToTop = ({ top = 20, className = '', smooth = false }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      setVisible(document.documentElement.scrollTop >= top)
    }
    onScroll()
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [top])

  return (
    <>
      {visible
        ? (
          <button
                    aria-label='Scroll to top'
                    className={`scroll-to-top ${className}`}
                    style={{ height: '4px', width: '4px', backgroundColor: 'transparent' }}
                    onClick={() => scrollToTop(smooth)}
          >
            <svg height='1.5em' viewBox='0 0 24 24' width='1.5em' xmlns='http://www.w3.org/2000/svg'>
              <path d='m12 11.325l2.375 2.375q.275.275.688.275t.712-.275q.3-.3.3-.712t-.3-.713L12.7 9.2q-.3-.3-.7-.3t-.7.3l-3.1 3.1q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8'
                              fill='#03a9f4'
              />
            </svg>
          </button>
          )
        : <></>
            }
    </>
  )
}

export default ScrollToTop
