import React from 'react';
import { SyncLoader } from 'react-spinners';

const Loader: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <SyncLoader />
        </div>
    );
};

export default Loader;