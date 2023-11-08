import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import ViewChangePasswd from '@/components/profile/ViewChangePasswd'
import React from 'react'

function ViewChangePasswdPage() {
  return (
    <div>
      <div className='height-screen-vh'>
        <Header />
        <ViewChangePasswd />
        <div className='sm:block hidden'>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default ViewChangePasswdPage