import {useOutletContext} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/material";
import {Radio, RadioGroup} from "@mui/joy";
import AppointmentSummary from "./AppointmentSummary.jsx";
import {useTranslation} from "react-i18next";

export default function AppointmentConfirmation() {
    const [appointmentData, setAppointmentData] = useOutletContext()
    const {t} = useTranslation('appointmentRequest')

    function handleDataChange(e) {
        setAppointmentData(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.confirm.title')}</Typography>
            <hr style={{width: '8rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <>
                <Typography level={'body-lg'} sx={{color: 'white'}}>
                    {t('component.confirm.note1')}
                </Typography>
                <AppointmentSummary appointmentData={appointmentData}/>
            </>
            <Typography level={'body-lg'} sx={{color: 'white'}}>
                {t('component.confirm.note2')}<br/>
                {t('component.confirm.note3', {button: t('button.back')})}
            </Typography>
            <Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={"body-lg"}
                                sx={{color: 'white'}}>{t('component.confirm.reminder.title')}</Typography>
                    <RadioGroup name={"reminder"} orientation="horizontal" onChange={handleDataChange}>
                        <Radio style={{color: 'white'}} value="yes" label={t('component.confirm.reminder.yes')}
                               checked={appointmentData.reminder === "yes"}/>
                        <Radio style={{color: 'white'}} value="no" label={t('component.confirm.reminder.no')}
                               checked={appointmentData.reminder === "no"}/>
                    </RadioGroup>
                </Stack>
            </Stack>
        </>
    )
}