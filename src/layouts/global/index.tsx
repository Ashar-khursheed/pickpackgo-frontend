import React from 'react'
import Footer from '../footer'

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>{children}<Footer /></div>
  )
}

export default GlobalLayout