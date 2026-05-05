import React from 'react'
import Footer from '../footer'
import { Toaster } from 'react-hot-toast'

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div><Toaster position="top-center" />{children}<Footer /></div>
  )
}

export default GlobalLayout