import Typography from "@mui/joy/Typography";
import {Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {Modal, ModalClose, Sheet} from "@mui/joy";
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

export default function AppointmentHistory() {
    const loaderData = useLoaderData()

    const {t} = useTranslation(['findDoctor', 'common'])
    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery"]
    const [showFilters, setShowFilters] = useState(false)
    const tableHeader = [t('table.id', {ns: 'common'}), t('table.datetime', {ns: 'common'}), t('table.department', {ns: 'common'}), t('table.doctor', {ns: 'common'}), t('table.status', {ns: 'common'})]
    const [showModal, setShowModal] = useState(false)
    const [currentAppointment, setCurrentAppointment] = useState({})
    const [appointmentData, setAppointmentData] = useState(loaderData.data.records)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState({
        query: searchParams.get('query') || '',
        department: searchParams.get('department') || 'default',
        status: searchParams.get('status') || 'default',
        dateType: 'date',
        startDate: searchParams.get('startDate') ? dayjs(searchParams.get('startDate')) : null,
        endDate: searchParams.get('endDate') ? dayjs(searchParams.get('endDate')) : null
    })
    const [sortOption, setSortOption] = useState({
        orderBy: 'id',
        order: 'asc'
    })

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
    }, [filters.department, filters.status, filters.startDate, filters.endDate]);

    function showDetail(appointmentID) {
        setShowModal(true)
    }

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
            endDate: filters.endDate ? filters.endDate.format('DD/MM/YYYY') : "none"
        }).toString()
        console.log("param", params)
        baseAxios.get('/appointments?' + params)
            .then(r => {
                console.log("appointment results: ", r)
                setAppointmentData(r.data.records)
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
            <Modal aria-labelledby="modal-title"
                   open={showModal} onClose={() => setShowModal(false)}
                   sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Sheet variant="outlined" sx={{minWidth: '30%', maxWidth: '50%', borderRadius: 'md', p: 3}}>
                    <Stack borderBottom={'1px solid'} marginBottom={'1rem'}>
                        <ModalClose variant="plain" sx={{m: 1}}/>
                        <Typography level="h4" sx={{fontWeight: 'lg', mb: 1}}>
                            Appointment Detail
                        </Typography>
                    </Stack>
                    <div className={'appointment-basic-info'}>
                        <Typography level="body1">Appointment ID: {currentAppointment.id}</Typography>
                        <Typography level="body1">Date & Time: {currentAppointment.date}</Typography>
                        <Typography level="body1">Department: {currentAppointment.department}</Typography>
                        <Typography level="body1">Provider: {currentAppointment.provider}</Typography>
                        <Typography level="body1">Status: {currentAppointment.status}</Typography>
                    </div>
                    <Stack marginTop={'1rem'} paddingTop={'1rem'} borderTop={'1px solid'}>
                        <Typography level="h4">Prescribed Medication</Typography>
                    </Stack>
                </Sheet>
            </Modal>
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
                            {appointmentData.map((item, index) => (
                                <Tooltip title={"Click to view detail"} key={index} followCursor>
                                    <TableRow onClick={() => showDetail(item[0])} sx={{
                                        '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                        '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                    }}>
                                        <TableCell>{item[0]}</TableCell>
                                        <TableCell>{item[2] + " " + dayjs(item[1]).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell>
                                            {t(`department.${item[6]}`, {ns: 'common'})}
                                        </TableCell>
                                        <TableCell>{item[7] + " " + item[8]}</TableCell>
                                        <TableCell>{t(`status.${item[4]}`, {ns: 'common'})}</TableCell>
                                    </TableRow>
                                </Tooltip>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    )
}