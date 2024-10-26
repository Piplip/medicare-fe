import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers";
import {Radio, RadioGroup} from "@mui/joy";
import {useOutletContext} from "react-router-dom";
import SelectedDoctor from "./SelectedDoctor.jsx";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

export default function Detail() {
    const [appointmentData, setAppointmentData] = useOutletContext()
    const {t} = useTranslation('appointmentRequest')

    function handleDataChange(e) {
        setAppointmentData(prev => ({...prev, [e.target.name]: e.target.value}))
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
                    <Typography className={'mandatory-field'} level={'h4'}
                                sx={{color: 'white'}}>{t('component.detail.date_time')}</Typography>
                    <Stack direction={'row'} alignItems={'center'} columnGap={2}>
                        <DatePicker disablePast={true} format={"DD/MM/YYYY"} label={"Chon ngay"}
                                    value={appointmentData.date}
                                    shouldDisableDate={(date) => date.day() === 0}
                                    onChange={(date) => setAppointmentData(prev => ({...prev, date}))}
                                    slotProps={{
                                        openPickerIcon: {sx: {color: 'white'}},
                                        textField: {
                                            sx: {
                                                '& input': {
                                                    backgroundColor: 'white',
                                                    fontSize: '1.25rem',
                                                    padding: '.75rem',
                                                },
                                            },
                                        },
                                    }}/>
                        <TimePicker orientation={'landscape'} format={"HH:mm"} value={appointmentData.time} ampm={false} disablePast
                                    minTime={dayjs().hour(8)}
                                    maxTime={dayjs().hour(23)}
                                    onChange={(time) => setAppointmentData(prev => ({...prev, time}))}
                                    slotProps={{
                                        openPickerIcon: {sx: {color: 'white', borderColor: 'white'}},
                                        textField: {
                                            sx: {
                                                '& input': {
                                                    backgroundColor: 'white',
                                                    fontSize: '1.25rem',
                                                    padding: '.75rem',
                                                },
                                            },
                                        },
                                    }}/>
                    </Stack>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography className={'mandatory-field'} level={'h4'}
                                sx={{color: 'white'}}>{t('component.detail.reason.title')}</Typography>
                    <textarea name={'reason'} style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '1rem',
                        width: '100%',
                        minWidth: '100%',
                        backgroundColor: 'rgb(246,246,246)',
                        fontFamily: 'cursive, sans-serif',
                        minHeight: '5rem',
                        maxHeight: '10rem',
                        maxWidth: '100%'
                    }}
                              placeholder={t('component.detail.reason.placeholder')}
                              value={appointmentData.reason}
                              onChange={handleDataChange}
                    />
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={'h4'} sx={{color: 'white'}}>{t('component.detail.referred.title')}</Typography>
                    <RadioGroup name={"isReferral"} orientation="horizontal" onChange={handleDataChange}>
                        <Radio style={{color: 'white'}} value="yes" label={t('component.detail.referred.yes')}
                               checked={appointmentData.isReferral === "yes"}/>
                        <Radio style={{color: 'white'}} value="no" label={t('component.detail.referred.no')}
                               checked={appointmentData.isReferral === "no"}/>
                    </RadioGroup>
                </Stack>
            </Stack>
        </>
    )
}