import Typography from "@mui/joy/Typography";
import SelectedDoctor from "./SelectedDoctor.jsx";
import {useLocation} from "react-router";
import {Stack} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function AppointmentSummary(props) {
    const appointmentData = props.appointmentData
    const location = useLocation()
    const {t} = useTranslation('appointmentRequest')

    function pad(num) {
        return num.toString().padStart(2, '0')
    }

    return (
        <div className={'appointment-confirmation-wrapper'}>
            <div>
                <Typography level={'h4'} sx={{color: '#919191'}}>{t('component.appointment_summary.for')}</Typography>
                <Typography level={'body-lg'} sx={{color: 'white'}}>{appointmentData.for}</Typography>
            </div>
            <div>
                <Typography level={'h4'} sx={{color: '#919191'}}>{t('component.appointment_summary.date')}</Typography>
                <Typography level={'body-lg'} sx={{color: 'white'}}>
                    {pad(appointmentData.date['$D']) + '/' + pad(appointmentData.date['$M'] + 1) + '/' + appointmentData.date['$y']}
                </Typography>
            </div>
            <div>
                <Typography level={'h4'} sx={{color: '#919191'}}>{t('component.appointment_summary.time')}</Typography>
                <Typography level={'body-lg'} sx={{color: 'white'}}>
                    {pad(appointmentData.time['$H']) + ':' + pad(appointmentData.time['$m'])}
                </Typography>
            </div>
            {location.pathname.includes("/payment") &&
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography level={'h4'}
                                sx={{color: '#919191'}}>{t('component.appointment_summary.status')}</Typography>
                    <Typography level={'body-lg'} sx={{color: 'white'}}>SCHEDULED</Typography>
                </Stack>
            }
            <div style={appointmentData.reason.length < 30 ? {display: 'flex', justifyContent: 'space-between'} : {}}>
                <Typography level={'h4'}
                            sx={{color: '#919191'}}>{t('component.appointment_summary.reason')}</Typography>
                <Typography level={'body-lg'} sx={{color: 'white', overflow: 'hidden', textOverflow: 'clip'}}>
                    {appointmentData.reason || "empty"}
                </Typography>
            </div>
            <div>
                <Typography level={'h4'}
                            sx={{color: '#919191'}}>{t('component.appointment_summary.provider')}</Typography>
                <SelectedDoctor appointmentData={appointmentData}/>
            </div>
        </div>
    )
}