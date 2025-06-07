import React from 'react'
import BeautyBanner from '../components/BeautyBanner'
import ComboPackages from '../components/ComboPackages'
import HomeServices from '../components/HomeServices/index'
import RatingCard from '../components/RatingCard'
import Review from '../components/Review'

const Home = () => {
  return (
    <div className="w-full min-w-full overflow-x-hidden">
      <BeautyBanner />
      <ComboPackages />
      <div className="w-full space-y-4 sm:space-y-6">
        <HomeServices />
        <RatingCard />
        <Review />
      </div>
    </div>
  )
}

export default Home