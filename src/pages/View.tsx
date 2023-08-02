import React from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router-dom';
import './View.css';

const View: React.FC = () => {
    const { REACT_APP_API_URL: API_URL, REACT_APP_VIDEO_TOKEN: VIDEO_TOKEN } = process.env;
    const { videoId } = useParams() as { [videoId: string]: string };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>View</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">View</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className='Video__video-wrapper'>
                    <video id="videoPlayer" width="650" controls autoPlay controlsList="download">
                        <source src={`${API_URL}/api/${videoId}?token=${VIDEO_TOKEN}`} type="video/mp4" />
                    </video>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default View;