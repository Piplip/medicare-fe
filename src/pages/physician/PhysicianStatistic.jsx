import '../../styles/physician-statistic.css'
import {Stack, Typography} from "@mui/material";
import {PieChart} from "@mui/x-charts";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {BarChart} from "@mui/x-charts/BarChart";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {useSearchParams} from "react-router-dom";
import {useLoaderData} from "react-router";
import UnauthenticatedModal from "../../components/UnauthenticatedModal.jsx";
import {staffAxios} from "../../config/axiosConfig.jsx";
import useHover from "../../custom hooks/useHovered.jsx";
import weekday from 'dayjs/plugin/weekday'
import {useTranslation} from "react-i18next";
import {StyledEngineProvider} from "@mui/system";

export default function PhysicianStatistic(){
    const data = useLoaderData()
    const [statisticData, setStatisticData] = useState(data ? data.data : null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [expand, setExpand] = useState(false)
    const [filter, setFilter] = useState({
        date: searchParams.get('date') ? dayjs(searchParams.get('date'), 'DD-MM-YYYY') : null,
        startDate: searchParams.get('startDate') ? dayjs(searchParams.get('startDate'), 'DD-MM-YYYY') : null,
        endDate: searchParams.get('endDate') ? dayjs(searchParams.get('endDate'), 'DD-MM-YYYY') : null,
    })
    const [overTimeView, setOverTimeView] = useState('w')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const [appointmentOverTime, setAppointmentOverTime] = useState([])
    const percentRef = useRef()
    const hovered = useHover(percentRef)
    const {t} = useTranslation('common')

    dayjs().locale('vi').format()
    dayjs.extend(weekday)

    useEffect(() => {
        if(statisticData){
            const dateOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

            const labels = [t('doctor.statistic.appointment.total'), t('doctor.statistic.appointment.done'), t('doctor.statistic.appointment.not-showed-up')]
            let chartData = Array(3).fill(null).map((_, index) => ({ data: [], label: labels[index]}));
            const temp = overTimeView === 'w' ?
                ((filter.startDate && filter.endDate) ? Array(filter.endDate.get("D") - filter.startDate.get("D") + 1).fill(0) :
                    Array(7).fill(0)) : Array(12).fill(0)
            if(filter.startDate && filter.endDate){
                for (let i = 0; i < filter.endDate.diff(filter.startDate, 'day') + 1; i++) {
                    const date = new Date(filter.startDate)
                    date.setDate(date.getDate() + i + 1)
                    chartData[0].data.push(statisticData[`${date.toISOString().split('T')[0]}`] || 0)
                    chartData[1].data.push(statisticData[`${date.toISOString().split('T')[0]}Done`] || 0)
                    chartData[2].data.push(statisticData[`${date.toISOString().split('T')[0]}NotShowUp`] || 0)
                }
            }
            else if(filter.startDate){
                for (let i = 0; i < 14; i++) {
                    const date = new Date(filter.startDate)
                    date.setDate(date.getDate() + i + 1)
                    chartData[0].data.push(statisticData[`${date.toISOString().split('T')[0]}`] || 0)
                    chartData[1].data.push(statisticData[`${date.toISOString().split('T')[0]}Done`] || 0)
                    chartData[2].data.push(statisticData[`${date.toISOString().split('T')[0]}NotShowUp`] || 0)
                }
            }
            else if(filter.endDate){
                for (let i = 14; i >= 0; i--) {
                    const date = new Date(filter.endDate)
                    date.setDate(date.getDate() - i + 1)
                    chartData[0].data.push(statisticData[`${date.toISOString().split('T')[0]}`] || 0)
                    chartData[1].data.push(statisticData[`${date.toISOString().split('T')[0]}Done`] || 0)
                    chartData[2].data.push(statisticData[`${date.toISOString().split('T')[0]}NotShowUp`] || 0)
                }
            }
            else{
                for(let i= 0 ; i<temp.length ; i++){
                    chartData[0].data.push(statisticData[overTimeView === 'w' ? dateOfWeek[i] : months[i].toUpperCase()] || 0)
                    chartData[1].data.push(statisticData[overTimeView === 'w' ? `${dateOfWeek[i]}Done` : `${months[i].toUpperCase()}Done`] || 0)
                    chartData[2].data.push(statisticData[overTimeView === 'w' ? `${dateOfWeek[i]}NotShowUp` : `${months[i].toUpperCase()}NotShowUp`] || 0)
                }
            }
            setAppointmentOverTime(chartData)
        }
    }, [statisticData, overTimeView]);

    useEffect(() => {
        const params = new URLSearchParams()
        if(filter.date) params.append('date', filter.date.format("DD-MM-YYYY"))
        if(filter.startDate){
            params.append('startDate', filter.startDate.format("DD-MM-YYYY"))
        }
        if(filter.endDate){
            params.append('endDate', filter.endDate.format("DD-MM-YYYY"))
        }
        params.append('view', overTimeView)
        setSearchParams(params)

        staffAxios.get('/fetch/statistic?' + params)
            .then(r => {
                console.log(r.data)
                setStatisticData(r.data)
            })
            .catch(err => console.log(err))
    }, [filter, overTimeView]);

    const currentWeekDays = () => {
        const date = filter.date ? dayjs(filter.date, 'DD-MM-YYYY') : dayjs()
        const startOfWeek = date.weekday(date.day() === 0 ? -6 : 1).toDate()

        let days = []
        if(filter.startDate && filter.endDate){
            for (let i = 0; i < filter.endDate.diff(filter.startDate, 'day') + 1; i++) {
                const day = new Date(filter.startDate);
                day.setDate(day.getDate() + i);
                days.push(day.toLocaleDateString("vi-US",  {weekday: filter.endDate.diff(filter.startDate, 'day') + 1 >= 9 ? undefined : "long"
                    , day: "2-digit", month: "2-digit"}));
            }
            return days;
        }
        else if(filter.startDate){
            for (let i = 0; i < 14; i++) {
                const day = new Date(filter.startDate);
                day.setDate(day.getDate() + i);
                days.push(day.toLocaleDateString("vi-VN",  {day: "2-digit", month: "2-digit"}));
            }
        }
        else if(filter.endDate){
            for (let i = 14; i >= 0; i--) {
                const day = new Date(filter.endDate);
                day.setDate(day.getDate() - i);
                days.push(day.toLocaleDateString("vi-VN",  {day: "2-digit", month: "2-digit"}));
            }
        }
        else{
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                days.push(day.toLocaleDateString("vi-VN",  {weekday: "long", day: "2-digit", month: "2-digit"}));
            }
        }

        return days;
    }

    function buildTitle(){
        if(filter.date) return t('doctor.statistic.title.1-date', {date: dayjs(filter.date).format("DD-MM-YYYY")})
        if(filter.startDate || filter.endDate){
            if(filter.startDate && !filter.endDate)
                return t('doctor.statistic.title.only-start', {start: dayjs(filter.startDate).format("DD-MM-YYYY")})
            if(!filter.startDate && filter.endDate)
                return t('doctor.statistic.title.only-end', {end: dayjs(filter.endDate).format("DD-MM-YYYY")})
            return t('doctor.statistic.title.date-range', {start: dayjs(filter.startDate).format("DD-MM-YYYY"), end: dayjs(filter.endDate).format("DD-MM-YYYY")})
        }
        return t('doctor.statistic.title.all-time')
    }

    return (
        <div className={'statistic-container'} style={{padding: '1rem', display: 'flex', flexDirection: 'column', rowGap: '1rem', alignItems: 'center'}}>
            <UnauthenticatedModal warn={"ACCESS DENIED"} message={"You haven't logged in! Please log in with your staff account"}/>
            <Stack sx={{alignItems: 'center'}}>
                <div className={'statistic-filter'}>
                    <p>{buildTitle()}</p>
                    {expand ?
                        <KeyboardArrowUpIcon onClick={() => setExpand(false)} />
                        :
                        <ExpandMoreIcon onClick={() => setExpand(true)} />
                    }
                </div>
                {expand &&
                    <Stack direction={'row'} columnGap={2} className={'statistic-filter-expand'}>
                        <Stack>
                            <DatePicker sx={{width: '200px'}} format={'DD-MM-YYYY'}
                                        label={t('doctor.statistic.filter.1-date')}
                                        value={filter.date}
                                        onChange={(date) => {
                                            setOverTimeView('w')
                                            setFilter({...filter, date: date, startDate: null, endDate: null})
                                        }}
                                        slotProps={{
                                            field: { clearable: true, onClear: () => setFilter(prev => ({...prev, date: null}))},
                                        }}
                            />
                        </Stack>
                        <p>{t('doctor.statistic.or')}</p>
                        <Stack>
                            <DatePicker sx={{width: '200px'}} format={'DD-MM-YYYY'}
                                    label={t('doctor.statistic.filter.start-date')}
                                value={filter.startDate}
                                onChange={(date) => {
                                    setOverTimeView('w')
                                    setFilter({...filter, startDate: date, date: null})
                                }}
                                        slotProps={{
                                            field: { clearable: true, onClear: () => setFilter(prev => ({...prev, startDate: null}))},
                                        }}
                            />
                        </Stack>
                        <p>-</p>
                        <Stack>
                            <DatePicker sx={{width: '200px'}} format={'DD-MM-YYYY'} label={t('doctor.statistic.filter.end-date')}
                                    value={filter.endDate}
                                    onChange={(date) => {
                                        setOverTimeView('w')
                                        setFilter({...filter, endDate: date, date: null})
                                    }}
                                    slotProps={{
                                        field: { clearable: true, onClear: () => setFilter(prev => ({...prev, endDate: null}))},
                                    }}
                            />
                        </Stack>
                    </Stack>
                }
            </Stack>
            {statisticData &&
                <Stack className={'statistic-info-container'} rowGap={'1rem'}>
                    <Stack direction={'row'} columnGap={'1rem'}>
                        <Stack className={'statistic-panel'}>
                            <Typography variant={'h5'}>{t('doctor.statistic.appointment.title')}</Typography>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 5, flexGrow: '1rem'}}>
                                <div>{t('doctor.statistic.appointment.total')}<br/><b>{statisticData['totalAppointment']}</b></div>
                                <div ref={percentRef}>{t('doctor.statistic.appointment.complete-cancel')}<br/>
                                    <b>
                                        <span style={{}}>{hovered ? Math.round((statisticData['done'] / statisticData['totalAppointment']) * 100) + "%" : statisticData['done']}</span>
                                        <span style={{color: 'white'}}> - </span>
                                        <span style={{}}>{hovered ? Math.round(statisticData['cancelAppointments'] / statisticData['totalAppointment']) * 100 + "%" : statisticData['cancelAppointments']}</span>
                                    </b>
                                </div>
                                <div>{t('doctor.statistic.appointment.total-patient')}<br/><b>{statisticData['allPatient']}</b></div>
                                <div>{t('doctor.statistic.appointment.not-showed-up')}<br/><b>{statisticData['notShowedUp']}</b></div>
                            </div>
                        </Stack>
                        <Stack textAlign={'center'} className={'statistic-panel'}>
                            <Typography variant={'h5'}>{t('doctor.statistic.appointment.gender-dis')}</Typography>
                            <PieChart colors={['deeppink', 'lightgreen', 'lightblue']}
                                      series={[
                                          {
                                              data: [
                                                  { id: 0, value: statisticData['male'], label: t('gender.male') },
                                                  { id: 1, value: statisticData['female'], label: t('gender.female') },
                                                  { id: 2, value: statisticData['other'], label: t('gender.other') },
                                              ],
                                              innerRadius: 20,
                                              cornerRadius: 5,
                                              arcLabel: (item) => item.value,
                                              arcLabelMinAngle: 20,
                                              arcLabelRadius: '60%',
                                          },
                                      ]}
                                      width={400} height={200}
                            />
                        </Stack>
                        <Stack textAlign={'center'} className={'statistic-panel'}>
                            <Typography variant={'h5'}>{t('doctor.statistic.appointment.age-dis')}</Typography>
                            <PieChart colors={['deeppink', 'lightgreen', 'lightblue', 'wheat']}
                                      series={[
                                          {
                                              data: [
                                                  { id: 0, value: statisticData['age0_2'], label: '0 - 2' },
                                                  { id: 1, value: statisticData['age2_18'], label: '2 - 18' },
                                                  { id: 2, value: statisticData['age18_49'], label: '18 - 49' },
                                                  { id: 3, value: statisticData['age50'], label: '50+' },
                                              ],
                                              innerRadius: 20,
                                              cornerRadius: 5,
                                              arcLabel: (item) => item.value,
                                              arcLabelMinAngle: 20,
                                              arcLabelRadius: '60%',
                                          },
                                      ]}
                                      width={400}
                                      height={200}
                            />
                        </Stack>
                    </Stack>
                    <Stack className={'statistic-panel'} alignItems={'center'}>
                        <Stack direction={'row'} justifyContent={'space-between'} sx={{width: '100%'}}>
                            <Typography variant={'h5'}>{t('doctor.statistic.appointment.over-time')}</Typography>
                            <Select value={overTimeView} onChange={(_, val) => {
                                setOverTimeView(val)
                                if(val === 'm') {
                                    setFilter(prev => ({...prev, startDate: null, endDate: null}))
                                }
                            }}>
                                <Option value={'w'}>{t('doctor.statistic.appointment.week')}</Option>
                                <Option value={'m'}>{t('doctor.statistic.appointment.month')}</Option>
                            </Select>
                        </Stack>
                        <BarChart colors={["lightblue", "lightgreen", "deeppink"]}
                                  xAxis={[{ scaleType: 'band', data: overTimeView === 'w' ? currentWeekDays() : months}]}
                                  yAxis={[
                                      {label: t('doctor.statistic.appointment.unit')}
                                  ]}
                                  className={'custom-bar-chart'}
                                  series={appointmentOverTime}
                                  width={1100}
                                  height={300}
                                  barLabel="value"
                        />
                    </Stack>
                </Stack>
            }
        </div>
    )
}