import {Stack} from "@mui/material";
import DefaultImage from "../../assets/default.jpg";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";

export default function SelectedDoctor(props) {
    const {t} = useTranslation('common')

    return (
        <div className={'appointment-detail-doctor'}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                   sx={{color: 'cyan', paddingBottom: '0.5rem', fontSize: '1.25rem'}} borderBottom={'1px solid white'}>
                <p>{props.appointmentData.doctor.name}</p>
                <p>{props.appointmentData.doctor.phone}</p>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <img alt={""} className={'provider-image'} src={props.appointmentData.doctor.image || DefaultImage}/>
                <div className={'provider-info'}>
                    <Stack spacing={1.25}>
                        <Stack>
                            <Typography variant={'body1'}>{t('department.title').toUpperCase()}</Typography>
                            <p>{t(`department.${props.appointmentData.doctor.department}`)}</p>
                        </Stack>
                        <Stack>
                            <Typography variant={'body1'}>{t('speciality.title').toUpperCase()}</Typography>
                            <div className={'specialization-wrapper'}
                                 style={{position: 'relative', width: 'fit-content'}}>
                                <Stack direction={'row'} alignItems={'center'}>
                                    <p>{t(`speciality.${props.appointmentData.doctor.specialization}`)}<span
                                        className={'more-info-tag'}>?</span></p>
                                    <div
                                        className={'more-info-content'}>{props.appointmentData.doctor["specialization-detail"]}</div>
                                </Stack>
                            </div>
                        </Stack>
                        <Stack>
                            <Typography variant={'body1'}>{t('lang.title').toUpperCase()}</Typography>
                            <p>{t(`lang.${props.appointmentData.doctor.language}`)}</p>
                        </Stack>
                    </Stack>
                </div>
            </Stack>
        </div>
    )
}