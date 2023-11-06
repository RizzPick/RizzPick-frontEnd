import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import ViewChangePasswd from '@/components/profile/ViewChangePasswd'
import React from 'react'

function ViewChangePasswdPage() {
  return (
    <div>
      <div className='sm:hidden'>
        <Header />
        <ViewChangePasswd />
      </div>

      <div className='sm:block hidden height-screen-vh'>
        <Header />
        <ViewChangePasswd />
        <Footer />
      </div>
    </div>
  )
}

export default ViewChangePasswdPage