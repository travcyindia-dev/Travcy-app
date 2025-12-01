"use client"
import Image from 'next/image'
import React from 'react'
// import img from '../../../public/rocket animation.gif'
import { Component } from '@/components/luma-spin'
import TravelLoading from '@/components/travel-loading'
const Loading = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-white z-50 overflow-hidden '>
        {/* <Image alt='loading' src={img} width={1500} height={1000} /> */}
        {/* Loading Please wai */}

        {/* <Component/> */}
        <TravelLoading/>
    </div>
  )
}

export default Loading