import React from 'react'
import BeautyBanner from '../components/BeautyBanner'
import ComboOffersDisc from '../components/ComboOffersDisc'
import RatingCard from '../components/RatingCard'
import Review from '../components/Review'

const Home = () => {
  return (
    <div className="w-full min-w-full overflow-x-hidden">
      <BeautyBanner />
      <div className="w-full space-y-4 sm:space-y-6">
        <ComboOffersDisc />
        <RatingCard />
        <Review />
      </div>
    </div>
  )
}

export default Home