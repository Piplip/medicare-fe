import {Stack} from "@mui/material";
import Me from '../../assets/me.png'
import Other from '../../assets/other.png'
import {useContext} from "react";
import {AppointmentContext} from "../../pages/RequestAppointment.jsx";
import Typography from "@mui/joy/Typography";
import {useOutletContext} from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {useLocation} from "react-router";
import baseAxios from "../../config/axiosConfig.jsx";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import { getStorage, ref, getDownloadURL} from "firebase/storage";
import {useTranslation} from "react-i18next";

export default function RequestAppointmentFor(){
    initializeApp(firebaseConfig);
    const storage = getStorage()

    const currentUser = useContext(UserContext).currentUser
    const [_, setAppointmentData] = useOutletContext()
    const props = useContext(AppointmentContext)
    const location = useLocation()
    const {t} = useTranslation('appointmentRequest')

    function nextStep(type){
        if(type === "me"){
            setAppointmentData(prev => ({
                ...prev,
                for: currentUser.lastName + ' ' + currentUser.firstName
            }))
        }
        if(!location.pathname.includes("none")){
            const doctorID = location.pathname.split('/')[2]
            console.log("doctor ID", doctorID)
            baseAxios.get(`/staff/id?id=${doctorID}`)
                .then(async res => {
                    console.log(res)
                    let storageRef = ref(storage, res.data[1])
                    await getDownloadURL(storageRef)
                        .then(url => {
                            setAppointmentData(prev => ({
                                ...prev,
                                doctor: {
                                    doctorID: location.pathname.split('/')[2],
                                    name: res.data[4] + ' ' + res.data[5],
                                    phone: res.data[6],
                                    department: res.data[8],
                                    specialization: res.data[9],
                                    'specialization-detail': res.data[10],
                                    language: res.data[7],
                                    image: url
                                }
                            }))
                        })
                })
                .catch(err => console.log(err))
        }
        props.goNextStep()
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.request-for.title')}</Typography>
            <hr style={{width: '4.75rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack direction={'row'} columnGap={'3rem'}>
                <Stack textAlign={'center'} fontSize={'1.5rem'} rowGap={1}>
                    <div className={'appointment-holder-wrapper'} onClick={() => nextStep("me")}>
                        <img className={'appointment-holder'} src={Me} alt={'Request Appointment For Me'}/>
                    </div>
                    <p>{t('component.request-for.type.me')}</p>
                </Stack>
                <Stack textAlign={'center'} fontSize={'1.5rem'} rowGap={1}>
                    <div className={'appointment-holder-wrapper'} onClick={() => nextStep("other")}>
                        <img className={'appointment-holder'} src={Other} alt={'Request Appointment For Me'}/>
                    </div>
                    <p>{t('component.request-for.type.other')}</p>
                </Stack>
            </Stack>
        </>
    )
}