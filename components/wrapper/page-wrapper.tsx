import React from 'react'
import NavBar from './navbar'
import Footer from './footer'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
      {children}
      {/* <Footer /> */}
    </>
  )
}