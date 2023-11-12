import UserLayout from '@/app/user/layout';
import Footer from '@/components/common/Footer';
import ViewChangePasswd from '@/components/profile/ViewChangePasswd';
import React from 'react';

function ViewChangePasswdPage() {
    return (
        <UserLayout showHeader={true}>
            <div>
                <div className="height-screen-vh">
                    <ViewChangePasswd />
                    <div className="sm:block hidden">
                        <Footer />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default ViewChangePasswdPage;
