import Footer from '@/components/common/Footer';
import ViewChangePasswd from '@/components/profile/ViewChangePasswd';
import React from 'react';

function ViewChangePasswdPage() {
    return (
        <div>
            <div className="height-screen-vh">
                <ViewChangePasswd />
                <div className="sm:block hidden">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default ViewChangePasswdPage;
