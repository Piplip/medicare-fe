import Typography from "@mui/joy/Typography";
import {Stack, Tooltip} from "@mui/material";
import {Radio, RadioGroup} from "@mui/joy";
import {useOutletContext} from "react-router-dom";
import SelectedDoctor from "./SelectedDoctor.jsx";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import baseAxios from "../../config/axiosConfig.jsx";
import Alert from '@mui/joy/Alert';
import Warning from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Detail() {
    const [appointmentData, setAppointmentData] = useOutletContext()
    const {t} = useTranslation('appointmentRequest')
    const [showError, setShowError] = useState(false)
    const [currentWeekDate, setCurrentWeekDate] = useState(dayjs())

    function handleDataChange(e) {
        setAppointmentData(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    console.log(currentWeekDate.format("DD-MM-YYYY"))
    const [scheduleData, setScheduleData] = useState()

    useEffect(() => {
        baseAxios.get('/appointment/doctor/schedule?date=' + currentWeekDate.format("DD-MM-YYYY") + "&staffID=" + appointmentData.doctor.doctorID)
            .then(r => {
                console.log(r)
                setScheduleData(r.data)
            }).catch(err => console.log(err))
    }, [currentWeekDate]);

    function handleSelectTime(x, y){
        let isInvalid
        isInvalid = scheduleData[x][y] || scheduleData[x][y] === null
        setShowError(isInvalid)
        let date
        if(x === 0){
            date = dayjs().day(1).format("DD/MM/YYYY")
        } else {
            date = dayjs().day(x + 1).format("DD/MM/YYYY")
        }
        let time = `${(8 + y).toString().padStart(2, '0')}:00`
        setAppointmentData(prev => ({...prev, date: date, time: time, invalidDate: isInvalid}))
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
                    <Typography className={'mandatory-field'} level={'h2'} textAlign={'center'}
                                sx={{color: 'white'}}>{t('component.detail.date_time')}</Typography>
                    <Stack alignItems={'center'} rowGap={'2rem'}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'} width={'100%'} borderBottom={'2px solid'} paddingBottom={2}>
                            <Typography level={'h3'} color={'white'}>Viewing Scheduling for current week</Typography>
                            <Stack direction={'row'} columnGap={1} alignItems={'end'}>
                                <div className={'detail-datetime'} style={{borderColor: appointmentData.date && appointmentData.time && !showError ? 'greenyellow' : "white"}}>
                                    {appointmentData.date && appointmentData.time
                                        ? <Stack direction={'row'} alignItems={'center'} columnGap={1}>{`Current: ${appointmentData.date} ${appointmentData.time}`}
                                            {!showError && <CheckCircleOutlineIcon sx={{color: 'lightgreen', fontSize: '2rem'}}/>}</Stack>
                                        : 'SELECT A WISHES DATE AND TIME BELOW'}
                                </div>
                                {showError &&
                                    <Alert color={'danger'} variant={'solid'} startDecorator={<Warning />}>
                                        Please select an available time
                                    </Alert>
                                }
                            </Stack>
                        </Stack>
                        {scheduleData &&
                            <Stack className={'doctor-schedule'}>
                                <NavigateBeforeIcon className={'navigate-btn navigate-before'} sx={{fontSize: '5rem'}}
                                                    onClick={() => {
                                                        if(dayjs().format('DD/MM/YYYY') === currentWeekDate.format('DD/MM/YYYY')) return
                                                        setCurrentWeekDate(prev => prev.subtract(1, 'week'))
                                                    }}
                                />
                                <NavigateNextIcon className={'navigate-btn navigate-after'} sx={{fontSize: '5rem'}}
                                                  onClick={() => setCurrentWeekDate(prev => prev.add(1, 'week'))}
                                />
                                <div className={'schedule-header'}>
                                    <Typography className={'schedule-body-item-time'} level={'body1'} sx={{color: 'white'}}>
                                        Time
                                    </Typography>
                                    {scheduleData.map((_, index) => {
                                        return (
                                            <Typography className={'schedule-body-item-time'} key={index} level={'body1'} sx={{color: 'white'}}>
                                                {currentWeekDate === dayjs() ? 'Today' : currentWeekDate.day(index+1).format('dddd DD/MM')}
                                            </Typography>
                                        )
                                    })}
                                </div>
                                <div className={'schedule-body'}>
                                    <div className={'schedule-body-item'}>
                                        {scheduleData[0].map((_, index) => {
                                            return (
                                                <div className={`schedule-body-item-time`} key={index}>
                                                    {`${8 + index}:00 - ${9 + index}:00`}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {scheduleData.map((day, index) => (
                                        <div key={index} className={'schedule-body-item time-cell'}>
                                            {day.map((time, _index) => (
                                                <Tooltip key={_index} title={time ? 'Someone has already choose this time' : ''} placement={'left'}>
                                                    <div className={`schedule-body-item-time ${!time ? 'available-time' : ''}`}
                                                         onClick={() => handleSelectTime(index, _index)}
                                                    >
                                                        {time === null ? <span style={{color: 'yellow'}}>--------</span>
                                                            : !time ? 'Available' : 'Unavailable now'}
                                                    </div>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </Stack>
                        }
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