import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";

export default function NeedToKnowInfo(){
    const {t} = useTranslation('appointmentRequest')
    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.info.title')}</Typography>
            <hr style={{width: '7.75rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack rowGap={2.5} fontSize={'1.25rem'}>
                <p>{t('component.info.condition.label')}</p>
                <ul style={{paddingLeft: '2em'}}>
                    <li>{t('component.info.condition.item.1')}</li>
                    <li>{t('component.info.condition.item.2')}</li>
                </ul>
                <p>{t('component.info.processing_time')}</p>
                <p>{t('component.info.emergency_1')}
                    <span style={{color: 'yellow', fontWeight: 'bold'}}>{import.meta.env.VITE_EMERGENCY_PHONE}</span>
                    {t('component.info.emergency_2')}
                </p>
            </Stack>
        </>
    )
}