import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers";
import {Radio, RadioGroup, Textarea} from "@mui/joy";
import {useOutletContext} from "react-router-dom";
import SelectedDoctor from "./SelectedDoctor.jsx";
import {useTranslation} from "react-i18next";

export default function Detail(){
    const [appointmentData, setAppointmentData] = useOutletContext()
    const {t} = useTranslation('appointmentRequest')

    function handleDataChange(e){
        setAppointmentData(prev => ({...prev, [e.target.name] : e.target.value}))
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.detail.title')}</Typography>
            <hr style={{width: '13.5rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack rowGap={4}>
                <Stack>
                    <Typography level={'h4'} sx={{color: 'white'}}>{t('component.detail.selected_doctor')}</Typography>
                    <SelectedDoctor appointmentData={appointmentData}/>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography className={'mandatory-field'} level={'h4'} sx={{color: 'white'}}>{t('component.detail.date_time')}</Typography>
                    <Stack direction={'row'} alignItems={'center'} columnGap={2}>
                        <DatePicker disablePast={true} format={"DD/MM/YYYY"}
                            value={appointmentData.date}
                            onChange={(date) => setAppointmentData(prev => ({...prev, date}))}
                            slotProps={{
                                openPickerIcon: {sx: {color: 'white'}},
                                textField: {
                                    sx: {
                                        '& input': {
                                            backgroundColor: 'white',
                                        },
                                    },
                                },
                            }}/>
                        <TimePicker orientation={'landscape'} format={"HH:mm"} value={appointmentData.time} ampm={false}
                            onChange={(time) => setAppointmentData(prev => ({...prev, time}))}
                            slotProps={{
                                openPickerIcon: {sx: {color: 'white', borderColor: 'white'}},
                                textField: {
                                    sx: {
                                        '& input': {
                                            backgroundColor: 'white',
                                        },
                                    },
                                },
                        }}/>
                    </Stack>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography className={'mandatory-field'} level={'h4'} sx={{color: 'white'}}>{t('component.detail.reason.title')}</Typography>
                    <Textarea name={'reason'} value={appointmentData.reason}
                              onChange={handleDataChange} minRows={2} placeholder={t('component.detail.reason.placeholder')}/>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={'h4'} sx={{color: 'white'}}>{t('component.detail.referred.title')}</Typography>
                    <RadioGroup name={"isReferral"} orientation="horizontal" onChange={handleDataChange}>
                        <Radio style={{color: 'white'}} value="yes" label={t('component.detail.referred.yes')} checked={appointmentData.isReferral === "yes"}/>
                        <Radio style={{color: 'white'}} value="no" label={t('component.detail.referred.no')} checked={appointmentData.isReferral === "no"}/>
                    </RadioGroup>
                </Stack>
            </Stack>
        </>
    )
}