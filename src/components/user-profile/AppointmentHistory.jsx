import Typography from "@mui/joy/Typography";
import {
    AppBar,
    Button, Dialog, IconButton, Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Toolbar,
    Tooltip
} from "@mui/material";
import {useEffect, useState} from "react";
import {useLoaderData} from "react-router";
import Input from "@mui/joy/Input";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import baseAxios from "../../config/axiosConfig.jsx";
import CloseIcon from "@mui/icons-material/Close";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

export default function AppointmentHistory() {
    const loaderData = useLoaderData()
    const {t} = useTranslation(['findDoctor', 'common'])
    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery"]
    const [showFilters, setShowFilters] = useState(false)
    const tableHeader = [t('table.id', {ns: 'common'}), t('table.datetime', {ns: 'common'}), t('table.department', {ns: 'common'}), t('table.doctor', {ns: 'common'}), t('table.status', {ns: 'common'})]
    const [showAppointmentDetail, setShowAppointmentDetail] = useState(false)
    const [appointmentData, setAppointmentData] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState({
        query: searchParams.get('query') || '',
        department: searchParams.get('department') || 'default',
        status: searchParams.get('status') || 'default',
        dateType: 'date',
        startDate: searchParams.get('startDate') ? dayjs(searchParams.get('startDate')) : null,
        endDate: searchParams.get('endDate') ? dayjs(searchParams.get('endDate')) : null,
        page: searchParams.get('page') || 1
    })
    const [sortOption, setSortOption] = useState({
        orderBy: 'id',
        order: 'asc'
    })
    const medicationHeader = ['Name', 'Dosage', 'Frequency', 'Quantity', 'Start Date', 'End Date', "Doctor's Note"]
    const [currentDetail, setCurrentDetail] = useState(null)
    const [totalPage, setTotalPage] = useState(parseInt(loaderData.data[0], 10) + 1)

    console.log(appointmentData)

    useEffect(() => {
        setAppointmentData(JSON.parse(loaderData.data[1])['records'])

    }, []);

    useEffect(() => {
        if (loaderData.data.records) {
            const sortedData = [...appointmentData]
            if (sortOption.orderBy === 'dname') {
                sortedData.sort((a, b) => {
                    return (a[7] + a[8]) > (b[7] + b[8]) ? 1 : -1
                })
            } else {
                let sortIndex = sortOption.orderBy === 'id' ? 0 : 1
                sortedData.sort((a, b) => {
                    if (sortOption.order === 'asc') {
                        return a[sortIndex] > b[sortIndex] ? 1 : -1
                    } else {
                        return a[sortIndex] < b[sortIndex] ? 1 : -1
                    }
                })
            }
            setAppointmentData(sortedData)
        }
    }, [sortOption]);

    useEffect(() => {
        fetchAppointments()
    }, [filters.department, filters.status, filters.startDate, filters.endDate, filters.page]);

    function handleSelectChange(type, value) {
        setFilters(prev => {
            return {...prev, [type]: value}
        })
    }

    function fetchAppointments() {
        let subParams = {}
        for (let key in filters) {
            if (filters[key] !== 'default' && filters[key] !== '' && key !== 'dateType' && filters[key] !== null) {
                if (key === 'startDate' || key === 'endDate') {
                    subParams[key] = filters[key].format('DD/MM/YYYY')
                } else
                    subParams[key] = filters[key]
            }
        }
        setSearchParams(subParams)

        const params = new URLSearchParams({
            email: localStorage.getItem('email'),
            status: filters.status,
            query: filters.query,
            department: filters.department,
            startDate: filters.startDate ? filters.startDate.format('DD/MM/YYYY') : "none",
            endDate: filters.endDate ? filters.endDate.format('DD/MM/YYYY') : "none",
            page: filters.page
        }).toString()
        baseAxios.get('/appointments?' + params)
            .then(r => {
                setAppointmentData(JSON.parse(r.data[1])['records'])
            })
            .catch(err => console.log(err))
    }

    function clearFilters() {
        setFilters({
            query: '',
            department: 'default',
            status: 'default',
            dateType: 'date',
            startDate: null,
            endDate: null
        })
    }

    return (
        <>
            <Dialog fullScreen open={showAppointmentDetail} onClose={() => setShowAppointmentDetail(false)}>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => {
                                setShowAppointmentDetail(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1, fontSize: '20px', fontWeight: 'bold', color: 'white'}}>
                            Detailed Prescription View
                        </Typography>
                        <Stack direction={'row'} columnGap={1}>
                            <Button variant="contained" color={'primary'} startIcon={<LocalPrintshopIcon/>}>
                                Print
                            </Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {currentDetail &&
                    <Stack sx={{paddingBlock: '20px'}} rowGap={1}>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>Prescription Details</p>
                            <Stack>
                                <div className={'prescription-detail-doctor-info'}>
                                    <p>Prescribing Doctor: <b>{currentDetail['doctorName']}</b></p>
                                    <p>Prescription Time: <b>{currentDetail['prescribedTime']}</b></p>
                                    <p>Specialization: <b>Cardiology</b></p>
                                    <p>Phone: <b>{currentDetail['phoneNumber'] || "------"}</b></p>
                                    <p>Total Medications: <b>{currentDetail['medicationList'].length}</b></p>
                                </div>
                                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'red'}}>Doctor Diagnosis
                                    <p className={'doctor-diagnosis'}>{currentDetail['diagnosis']}</p>
                                </div>
                            </Stack>
                            <Stack>
                                <p style={{color: 'red', fontWeight: 'bold', fontSize: '1.25rem'}}>Prescribed Medications</p>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                                {medicationHeader.map((item, index) =>
                                                    <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentDetail['medicationList'].map((item, index) => (
                                                <TableRow key={index} sx={{
                                                    '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                                    '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                                }}>
                                                    <TableCell>{item['name']}</TableCell>
                                                    <TableCell>{item['dosage']}</TableCell>
                                                    <TableCell>{item['frequency']}</TableCell>
                                                    <TableCell>{item['quantity']}</TableCell>
                                                    <TableCell>{dayjs(item['startDate']).format('DD-MM-YYYY')}</TableCell>
                                                    <TableCell>{dayjs(item['endDate']).format('DD-MM-YYYY')}</TableCell>
                                                    <TableCell>{item['note']}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>Pharmacist Notes</p>
                            <textarea style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '14px',
                                width: '100%',
                                minWidth: '100%',
                                backgroundColor: '#f9f9f9',
                                fontFamily: 'cursive, sans-serif',
                                minHeight: '5rem',
                                maxHeight: '10rem',
                                maxWidth: '100%'
                            }}
                                      placeholder={'Enter note here'}
                            />
                        </Stack>
                    </Stack>
                }
            </Dialog>
            <Stack rowGap={'1rem'}>
                <Typography color={'white'}
                            level={'h2'}>{t('user_profile.appointment-history.title', {ns: 'common'})}</Typography>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input
                            placeholder={t('user_profile.appointment-history.filter.search-placeholder', {ns: 'common'})}
                            autoFocus sx={{minWidth: '20rem'}}
                            onChange={(e) => setFilters(prev => {
                                return {...prev, query: e.target.value}
                            })}
                        />
                        <Button variant="contained" onClick={fetchAppointments}>
                            {t('user_profile.appointment-history.button.search', {ns: 'common'})}
                        </Button>
                    </Stack>
                    <Button variant="contained" startIcon={<FilterAltIcon/>}
                            onClick={() => setShowFilters(prev => !prev)}>
                        {t('user_profile.appointment-history.button.sort-filter', {ns: 'common'})}
                    </Button>
                </Stack>
                {showFilters &&
                    <Stack>
                        <Stack rowGap={2} className={'sort-filter-panel'} sx={{width: '100%'}}>
                            <p className={'clear-filter-btn'} onClick={clearFilters}>
                                {t('user_profile.appointment-history.button.clear', {ns: 'common'})}
                            </p>
                            <Stack direction={'row'} columnGap={3}>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>
                                        {t('user_profile.appointment-history.filter.date.title', {ns: 'common'})}
                                    </Typography>
                                    <Select defaultValue={"date"} value={filters.dateType}
                                            onChange={(_, val) => handleSelectChange('dateType', val)}>
                                        <Option
                                            value={"date"}>{t('user_profile.appointment-history.filter.date.date', {ns: 'common'})}</Option>
                                        <Option
                                            value={"range"}>{t('user_profile.appointment-history.filter.date.range', {ns: 'common'})}</Option>
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>
                                        {filters.dateType === 'date' ?
                                            t('user_profile.appointment-history.filter.date.title-2', {ns: 'common'})
                                            :
                                            t('user_profile.appointment-history.filter.date.title-3', {ns: 'common'})
                                        }
                                    </Typography>
                                    <DatePicker value={filters.startDate} format={"DD/MM/YYYY"}
                                                onChange={(val) => setFilters(prev => {
                                                    return {...prev, startDate: val}
                                                })}
                                                sx={{
                                                    '& .MuiInputBase-input': {padding: '0.4rem 0.75rem'},
                                                    '& .MuiInputBase-root': {
                                                        border: '1px solid white',
                                                        backgroundColor: 'white'
                                                    },
                                                    // '& .MuiSvgIcon-root': {color: 'white'},
                                                }}
                                    />
                                    {filters.dateType === 'range' &&
                                        <DatePicker value={filters.endDate} format={"DD/MM/YYYY"}
                                                    onChange={(val) => setFilters(prev => {
                                                        return {...prev, endDate: val}
                                                    })}
                                                    sx={{
                                                        '& .MuiInputBase-input': {padding: '0.4rem 0.75rem'},
                                                        '& .MuiInputBase-root': {
                                                            border: '1px solid white',
                                                            backgroundColor: 'white'
                                                        },
                                                        // '& .MuiSvgIcon-root': {color: 'white'},
                                                    }}
                                        />
                                    }
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography
                                        variant={'body2'}>{t('department.title', {ns: 'common'}).toUpperCase()}</Typography>
                                    <Select onChange={handleSelectChange} value={filters.department}>
                                        <Option select-type={'department'} value="default"
                                                onClick={() => handleSelectChange('department', 'default')}
                                        >{t('department.default', {ns: 'common'})}</Option>
                                        {department.map((department, index) => (
                                            <Option select-type={'department'} value={department} key={index}
                                                    onClick={() => handleSelectChange('department', department)}
                                            >
                                                {t(`department.${department}`, {ns: 'common'})}</Option>
                                        ))}
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>STATUS</Typography>
                                    <Select defaultValue={"default"} value={filters.status}
                                            onChange={(_, val) => handleSelectChange('status', val)}>
                                        <Option value={"default"}>
                                            {t('user_profile.appointment-history.filter.status.all', {ns: 'common'})}
                                        </Option>
                                        <Option value={"SCHEDULE"}>
                                            {t('user_profile.appointment-history.filter.status.scheduled', {ns: 'common'})}
                                        </Option>
                                        <Option value={"CONFIRMED"}>
                                            {t('user_profile.appointment-history.filter.status.confirmed', {ns: 'common'})}
                                        </Option>
                                        <Option value={"CANCELLED"}>
                                            {t('user_profile.appointment-history.filter.status.cancelled', {ns: 'common'})}
                                        </Option>
                                    </Select>
                                </Stack>
                                <Stack columnGap={3} direction={'row'}
                                       sx={{borderLeft: '2px solid yellow', paddingLeft: '1.25rem'}}>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>
                                            {t('user_profile.appointment-history.filter.order.title', {ns: 'common'})}
                                        </Typography>
                                        <Select defaultValue={'id'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, orderBy: value}
                                        })}>
                                            <Option value={'id'}>
                                                {t('user_profile.appointment-history.filter.order.id', {ns: 'common'})}
                                            </Option>
                                            <Option value={'dname'}>
                                                {t('user_profile.appointment-history.filter.order.name', {ns: 'common'})}
                                            </Option>
                                            <Option value={'datetime'}>
                                                {t('user_profile.appointment-history.filter.order.datetime', {ns: 'common'})}</Option>
                                        </Select>
                                    </Stack>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>
                                            {t('user_profile.appointment-history.filter.order.title-2', {ns: 'common'})}
                                        </Typography>
                                        <Select defaultValue={'asc'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, order: value}
                                        })}>
                                            <Option value={'asc'}>
                                                {t('order.asc', {ns: 'common'})}
                                            </Option>
                                            <Option value={'desc'}>
                                                {t('order.desc', {ns: 'common'})}
                                            </Option>
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                }
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                {tableHeader.map((item, index) =>
                                    <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointmentData &&
                                appointmentData.map((item, index) => (
                                    <Tooltip title={"Click to view detail"} key={index} followCursor>
                                        <TableRow sx={{
                                            '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                            '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                        }}
                                                  onClick={() => {
                                                      baseAxios.get('/appointment/detail?appointmentID=' + item[0])
                                                          .then(r => {
                                                              console.log(r)
                                                              setCurrentDetail(r.data)
                                                              setShowAppointmentDetail(true)
                                                          })
                                                          .catch(err => {
                                                              alert("This appointment doesn't have detail because you are not showing up!")
                                                          })
                                                  }}
                                        >
                                            <TableCell>{item[0]}</TableCell>
                                            <TableCell>{item[2] + " " + dayjs(item[1]).format("DD/MM/YYYY")}</TableCell>
                                            <TableCell>
                                                {t(`department.${item[6]}`, {ns: 'common'})}
                                            </TableCell>
                                            <TableCell>{item[7] + " " + item[8]}</TableCell>
                                            <TableCell>{t(`${item[4]}`, {ns: 'common'})}</TableCell>
                                        </TableRow>
                                    </Tooltip>
                                ))
                            }
                        </TableBody>
                    </Table>
                    {appointmentData && appointmentData.length == 0 &&
                        <div className={'empty-table'}>
                            No appointments
                        </div>
                    }
                    <Stack alignSelf={'center'} marginTop={1} direction={'row'} justifyContent={'center'} columnGap={2}
                        sx={{backgroundColor: 'white', paddingBlock: '.25rem'}}
                    >
                        <Pagination count={totalPage} color={'primary'} page={parseInt(filters.page, 10)}
                                    onChange={(_, page) => {
                                        setFilters(prev => {
                                            return {...prev, page: page}
                                        })
                                    }}/>
                    </Stack>
                </TableContainer>
            </Stack>
        </>
    )
}