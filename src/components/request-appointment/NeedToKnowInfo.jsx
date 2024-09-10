import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";

export default function NeedToKnowInfo(){
    const {t} = useTranslation('appointmentRequest')
    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>Request an Appointment</Typography>
            <hr style={{width: '7.75rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack rowGap={2.5} fontSize={'1.25rem'}>
                <p>In order to continue, you&apos;ll need to guaranteed that</p>
                <ul style={{paddingLeft: '2em'}}>
                    <li>You are 18 years old or above</li>
                    <li>Ensure to provide flagrant information</li>
                </ul>
                <p>This appointment request will be processed at most 1 business day</p>
                <p>If this is an emergency, please contact <span style={{color: 'yellow', fontWeight: 'bold'}}>{t('emergency_number', {ns: 'common'})}</span> or go to the nearest emergency department</p>
            </Stack>
        </>
    )
}