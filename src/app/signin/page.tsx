import LoginForm from '@/components/user/LoginForm';
import React from 'react';
import RootLayout from '../layout';

function Loginpage() {
    return (
        <div className="bg-signuppage-gradient">
            <RootLayout showHeader={false}>
                <LoginForm />
            </RootLayout>
        </div>
    );
}

export default Loginpage;
