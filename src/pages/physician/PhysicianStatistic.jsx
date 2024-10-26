import '../../styles/physician-statistic.css'
import {Stack, Typography} from "@mui/material";
import {PieChart} from "@mui/x-charts";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {BarChart} from "@mui/x-charts/BarChart";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useState} from "react";
import dayjs from "dayjs";

export default function PhysicianStatistic(){
    const [expand, setExpand] = useState(false)
    const [filter, setFilter] = useState({
        date: null,
        startDate: null,
        endDate: null
    })

    console.log(filter)

    function buildTitle(){
        if(filter.date) return `Statistics for ${dayjs(filter.date).format("DD-MM-YYYY")}`
        if(filter.startDate || filter.endDate){
            if(filter.startDate && !filter.endDate) return `Statistics from ${dayjs(filter.startDate).format("DD-MM-YYYY")} to now`
            if(!filter.startDate && filter.endDate) return `Statistics from the beginning to ${dayjs(filter.endDate).format("DD-MM-YYYY")}`
            return `Statistics from ${dayjs(filter.startDate).format("DD-MM-YYYY")} to ${dayjs(filter.endDate).format("DD-MM-YYYY")}`
        }
        return 'Statistics for all time'
    }

    return (
        <div className={'statistic-container'} style={{padding: '1rem', display: 'flex', flexDirection: 'column', rowGap: '1rem', alignItems: 'center'}}>
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
                                        label={"Specific Date"}
                                        value={filter.date}
                                        onChange={(date) => setFilter({...filter, date: date, startDate: null, endDate: null})}
                                        slotProps={{
                                            field: { clearable: true, onClear: () => setFilter(prev => ({...prev, date: null}))},
                                        }}
                            />
                        </Stack>
                        <p>or</p>
                        <Stack>
                            <DatePicker sx={{width: '200px'}} format={'DD-MM-YYYY'}
                                    label={"Start Date"}
                                value={filter.startDate}
                                onChange={(date) => setFilter({...filter, startDate: date, date: null})}
                                        slotProps={{
                                            field: { clearable: true, onClear: () => setFilter(prev => ({...prev, startDate: null}))},
                                        }}
                            />
                        </Stack>
                        <p>-</p>
                        <Stack>
                            <DatePicker sx={{width: '200px'}} format={'DD-MM-YYYY'} label={"End Date"}
                                    value={filter.endDate}
                                    onChange={(date) => setFilter({...filter, endDate: date, date: null})}
                                    slotProps={{
                                        field: { clearable: true, onClear: () => setFilter(prev => ({...prev, endDate: null}))},
                                    }}
                            />
                        </Stack>
                    </Stack>
                }
            </Stack>
           <Stack className={'statistic-info-container'} rowGap={'1rem'}>
               <Stack direction={'row'} columnGap={'1rem'}>
                   <Stack className={'statistic-panel'}>
                       <Typography variant={'h5'}>Appointment Statistics</Typography>
                       <p>Total appointments: 12</p>
                       <p>Appointment cancellations: 1</p>
                       <p>Patient satisfaction rating: 4.2</p>
                       <p>Average appointment duration: 25 minutes</p>
                       <p>Total referred patient: 25</p>
                       <p>Total no-show patient: 4</p>
                   </Stack>
                   <Stack textAlign={'center'} className={'statistic-panel'}>
                       <Typography variant={'h5'}>Gender distribution</Typography>
                       <PieChart
                           series={[
                               {
                                   data: [
                                       { id: 0, value: 20, label: 'Male' },
                                       { id: 1, value: 15, label: 'Female' },
                                       { id: 2, value: 2, label: 'Other' },
                                   ],
                               },
                           ]}
                           width={400}
                           height={200}
                       />
                   </Stack>
                   <Stack textAlign={'center'} className={'statistic-panel'}>
                       <Typography variant={'h5'}>Age distribution</Typography>
                       <PieChart
                           series={[
                               {
                                   data: [
                                       { id: 0, value: 20, label: '0 - 2' },
                                       { id: 1, value: 5, label: '2 - 18' },
                                       { id: 2, value: 12, label: '18 - 49' },
                                       { id: 3, value: 2, label: '50+' },
                                   ],
                               },
                           ]}
                           width={400}
                           height={200}
                       />
                   </Stack>
               </Stack>
               <Stack className={'statistic-panel'}>
                   <Stack direction={'row'} justifyContent={'space-between'}>
                       <Typography variant={'h5'}>Appointment over time</Typography>
                       <Select defaultValue={'d'}>
                           <Option value={'d'}>Day</Option>
                           <Option value={'m'}>Month</Option>
                       </Select>
                   </Stack>
                   <BarChart
                       xAxis={[{ scaleType: 'band', data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}]}
                       series={[{data: [2, 3, 5, 2, 10, 6, 8]}]}
                       width={1000}
                       height={300}
                   />
               </Stack>
           </Stack>
        </div>
    )
}