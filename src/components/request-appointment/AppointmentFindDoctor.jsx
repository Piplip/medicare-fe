import FindDoctor from "../../pages/FindDoctor.jsx";
import {useOutletContext} from "react-router-dom";
import {useContext} from "react";
import {AppointmentContext} from "../../pages/RequestAppointment.jsx";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";

export default function AppointmentFindDoctor() {
    const [_, setAppointmentData] = useOutletContext()
    const props = useContext(AppointmentContext)
    const {t} = useTranslation('appointmentRequest')

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.find-doctor.title')}</Typography>
            <hr style={{width: '13.5rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <FindDoctor setAppointmentData={setAppointmentData} goNextStep={props.goNextStep}/>
        </>
    )
}