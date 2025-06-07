import React from 'react'
import BeautyBanner from '../components/BeautyBanner'
import HomeServicesSection from '../components/HomeServicesSection'
import RatingCard from '../components/RatingCard'
import Review from '../components/Review'

const Home = () => {
  return (
    <div className="w-full min-w-full overflow-x-hidden">
      <BeautyBanner />
      <HomeServicesSection />
      <div className="w-full space-y-4 sm:space-y-6">
        <RatingCard />
        <Review />
      </div>
    </div>
  )
}

export default Home