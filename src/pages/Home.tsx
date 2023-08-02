import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToast, IonToolbar, useIonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { eyeOutline, trashOutline } from "ionicons/icons";
import './Home.css';

const Home: React.FC = () => {
  const { REACT_APP_API_URL: API_URL, REACT_APP_AUTH_USER: AUTH_USER, REACT_APP_AUTH_PASSWORD: AUTH_PASSWORD } = process.env;
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [files, setFiles] = useState<string[]>([]);
  const [toastMesg, setToastMesg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const toastHelper = (msg: string) => {
    setToastMesg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000)
  }

  const handleViewVideo = async (file: string) => {
    history.push({
      pathname: "/view/" + encodeURI(file)
    });
  }

  const handleRemoveVideo = async (file: string) => {
    try {
      presentAlert({
        mode: "ios",
        header: "Do you really want to remove the video?",
        buttons: [
          {
            text: "Cancel",
            role: 'cancel',
            handler: () => {
              setToastMesg("");
            },
          },
          {
            text: "Confirm",
            role: 'confirm',
            handler: async () => {
              try {
                const res = await axios({
                  method: "DELETE",
                  url: API_URL + "/api/" + encodeURI(file),
                  auth: {
                    username: AUTH_USER || 'foo',
                    password: AUTH_PASSWORD || 'foo'
                  }
                })
                if (res && res.status === 200) {
                  toastHelper("Video successfully removed!");
                  setFiles(prev => prev.filter(f => f !== file))
                }
              } catch (error) {
                toastHelper("Couldn't remove video!");
              }
            },
          },
        ]
      })
    } catch (error) {
      toastHelper("Couldn't remove video!");
    }
  }

  useEffect(() => {
    (
      async () => {
        try {
          const res = await axios({
            method: "GET",
            url: API_URL + "/api/files",
            auth: {
              username: AUTH_USER || 'foo',
              password: AUTH_PASSWORD || 'foo'
            }
          })
          if (res && res.status === 200 && res["data"]) {
            const { files } = res["data"];
            setFiles(files);
          }
        } catch (error) {
          console.log("");
        }
      }
    )()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {
            files.map(file => {
              return (
                <IonItem key={file}>
                  <IonLabel onClick={() => handleViewVideo(file)}>{file}</IonLabel>
                  <IonButton onClick={() => handleViewVideo(file)}><IonIcon icon={eyeOutline} /></IonButton>
                  <IonButton color="danger" onClick={() => handleRemoveVideo(file)}><IonIcon icon={trashOutline} /></IonButton>
                </IonItem>
              )
            })
          }
        </IonList>
        <IonToast
          isOpen={showToast}
          position="top"
          onDidDismiss={() => setShowToast(false)}
          message={toastMesg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
