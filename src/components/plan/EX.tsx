// DataFetcher.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Write from '@/components/plan/Write';

export default function DataFetcher() {
    const [initialData, setInitialData] = useState(null);
    const [initialActivities, setInitialActivities] = useState([]);

    useEffect(() => {
        // 데이터를 가져오는 로직
        axios.get('/your-data-endpoint').then((response) => {
            setInitialData(response.data);
        });

        axios.get('/your-activities-endpoint').then((response) => {
            setInitialActivities(response.data);
        });
    }, []);

    const onEditComplete = () => {
        console.log('Edit complete');
    };

    return (
        <div>
            {initialData && initialActivities ? (
                <Write
                    initialData={initialData}
                    initialActivities={initialActivities}
                    onEditComplete={onEditComplete}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
