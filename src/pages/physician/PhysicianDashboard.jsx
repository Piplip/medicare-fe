import '../../styles/physician-dashboard-style.css'
import {useEffect, useRef, useState} from "react";
import {
    Alert, AppBar,
    Button, Dialog,
    FormControlLabel, IconButton, Pagination,
    Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Toolbar, Tooltip,
    Typography
} from "@mui/material";
import {useLoaderData} from "react-router";
import UnauthenticatedModal from "../../components/UnauthenticatedModal.jsx";
import Input from "@mui/joy/Input";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/joy/Checkbox";
import dayjs from "dayjs";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AddMedicineModal from "../../components/AddMedicineModal.jsx";
import {Snackbar} from "@mui/joy";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {staffAxios} from "../../config/axiosConfig.jsx";
import CloseIcon from "@mui/icons-material/Close";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import {useTranslation} from "react-i18next";
import {useReactToPrint} from "react-to-print";

export default function PhysicianDashboard(){
    const {t} = useTranslation('common')
    const loaderData = useLoaderData()
    const appointments = JSON.parse(loaderData?.data[1])['records'] ?? null
    const [snackBar, setSnackBar] = useState({
        show: false, content: null
    })
    const [filterAppointments, setFilterAppointments] = useState([])
    const [currentAppointment, setCurrentAppointment] = useState(null)
    const [medicineModal, setMedicineModal] = useState({
        open: false,
        type: null
    })
    const [filter, setFilter] = useState({
        query: "",
        startDate: null,
        endDate: null,
        status: [1,1,1,1,1]
    })
    const [openDetail, setOpenDetail] = useState(false)
    const header = ['appointment-id', 'patient-name', 'address', 'appointment-time', 'reason', 'status']
    const refStatus = {"DONE": 0, "CANCELLED": 1, "SCHEDULED": 2, "CONFIRMED": 3, "NOT_SHOWED_UP": 4}
    const statusBadgeBgColor = {"SCHEDULED": "#3d3d3d", "CONFIRMED": "blue", "CANCELLED": "#ff0000", "DONE": "green", "NOT_SHOWED_UP": "gray"}
    const statusBadgeTextColor = {"SCHEDULED": "white", "CONFIRMED": "white", "CANCELLED": "white", "DONE": "white", "NOT_SHOWED_UP": "white"}
    const [showAlert, setShowAlert] = useState(false)
    const [sortOption, setSortOption] = useState({
        time: 1, id: null, name: null
    })
    const [pagination, setPagination] = useState({
        page: 1, size: 10, totalRecord: parseInt(loaderData.data[0], 10)
    })
    const medicationHeader = ['m-name', 'dosage', 'frequency', 'm-start-date', 'm-end-date', "m-doctor-note"]
    const [currentDetail, setCurrentDetail] = useState(null)
    const printRef = useRef(null)
    const handlePrint = useReactToPrint({
        contentRef: printRef
    })

    useEffect(() => {
        setFilterAppointments(appointments)
    }, [loaderData]);

    useEffect(() => {
        staffAxios.get('/fetch/appointments?' + new URLSearchParams({"query": filter.query,
            "startDate": filter.startDate !== null ? dayjs(filter.startDate).format("YYYY-MM-DD") : null,
            "endDate": filter.endDate !== null ? dayjs(filter.endDate).format("YYYY-MM-DD") : null,
            "page": pagination.page, "size": pagination.size}))
            .then(r => {
                setFilterAppointments(JSON.parse(r?.data[1])['records'])
                setPagination(prev => ({...prev, totalRecord: parseInt(r?.data[0], 10)}))
            }).catch(err => console.log(err))
    }, [filter.query, filter.startDate, filter.endDate, pagination.page]);

    useEffect(() => {
        if(appointments !== null){
            setFilterAppointments(appointments.filter(item => {
                if(filter.status[refStatus[item[14]]] !== 1) return false
                return item
            }))
        }
    }, [filter.status]);

    useEffect(() => {
        doFilter()
    }, [sortOption]);

    function doFilter(){
        if(appointments && filterAppointments){
            if(sortOption.id !== null){
                setFilterAppointments((prev) => [...prev].sort((a, b) => {
                    return (a[0] - b[0]) * sortOption.id
                }))
            }
            if(sortOption.name !== null){
                setFilterAppointments((prev) => [...prev].sort((a, b) => {
                    return (a[6] + " " + a[5] > b[6] + " " + b[5] ? 1 : -1) * sortOption.name
                }))
            }
            if(sortOption.time !== null){
                setFilterAppointments((prev) => [...prev].sort((a, b) => {
                    return (new Date(a[4] + " " + a[3]).getTime() - new Date(b[4] + " " + b[3]).getTime()  ? 1 : -1) * sortOption.time
                }))
            }
        }
    }

    function compareDate(date, time){
        const _date = new Date(time + " " + date)
        const now = new Date()
        now.setTime(now.getTime())
        return (now.toDateString() === _date.toDateString()) && (now.getHours() <= _date.getHours())
    }

    function handleChangeStatus(index){
        const prevStatus = [...filter.status]
        if(prevStatus.reduce((a, b) => a + b) === 1 && prevStatus[index] === 1){
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
            return
        }
        prevStatus[index] ^= 1
        setFilter(prev => ({...prev, status: prevStatus}))
    }

    return (
        <div className={'physician-dashboard'}>
            <Snackbar variant="soft"
                color={snackBar.content === t('doctor.dashboard.snackbar.success') ? "success" : "danger"}
                open={snackBar.show}
                onClose={() => setSnackBar({
                    show: false, content: null
                })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                endDecorator={snackBar.content === t('doctor.dashboard.snackbar.success') ? <CheckCircleOutlineIcon /> : <WarningAmberIcon />}
            >
                {snackBar.content}
            </Snackbar>
            {currentAppointment !== null &&
                <AddMedicineModal open={medicineModal.open} setMedicineModal={setMedicineModal} appointment={appointments[currentAppointment]}
                                  snackBar={snackBar} setSnackBar={setSnackBar}/>
            }
            <UnauthenticatedModal warn={t('authorized.warn').toUpperCase()} message={t('authorized.msg-1')}/>
            <div style={{backgroundColor: 'white'}}>
                <p className={'physician-panel-title'}>{t('doctor.dashboard.title').toUpperCase()}</p>
                <Stack columnGap={1} rowGap={.5} padding={'1rem'}>
                    <div style={{borderBottom: '2px solid', paddingBottom: '.5rem'}}>
                       <Typography variant={'h6'}>{t('doctor.dashboard.upcoming')}</Typography>
                        <Stack direction={'row'} gap={1} sx={{flexWrap: 'wrap'}}>
                            {appointments && appointments.map((item, index) => {
                                return (
                                    compareDate(item[3], item[4]) &&
                                    <Stack key={index}
                                           className={`simple-appointment-card ${new Date().getHours() + 1 == item[4].split(':')[0] ? 'current-appointment' : ''}`}>
                                        <div onClick={() => setCurrentAppointment(index)}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <p>{item[6] + " " + item[5]}</p>
                                                <p>{item[4]}</p>
                                            </Stack>
                                            <p style={{marginTop: '0.5rem'}}>{item[2]}</p>
                                        </div>
                                        <div className={'add-medicine-btn'} onClick={() => {
                                            setCurrentAppointment(index)
                                            setMedicineModal({
                                                type: 'done', open: true
                                            })
                                        }}>
                                            {item[14] === 'DONE' ? t('doctor.dashboard.view-medicine') : t('doctor.dashboard.add-medicine')}
                                        </div>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </div>
                    {appointments && appointments[currentAppointment] &&
                        <Stack sx={{border: '5px solid', padding: '0.5rem 1rem'}}>
                            <Typography variant={'h5'} textAlign={'center'}>{t('doctor.dashboard.quick-detail.title').toUpperCase()}</Typography>
                            <div className={'detail-appointment-view'}>
                                <p>{t('table.patient-name')}: {appointments[currentAppointment][6]} {appointments[currentAppointment][5]}</p>
                                <p>{t('table.dob')}: {appointments[currentAppointment][7]}</p>
                                <p>{t('table.address')}: {appointments[currentAppointment][9]}, {appointments[currentAppointment][10]}, {appointments[currentAppointment][11]}, {appointments[currentAppointment][12]}</p>
                                <p>{t('table.gender')}: {t(`gender.${appointments[currentAppointment][8]}`)}</p>
                                <p>{t('table.appointment-time')}: {new Date(appointments[currentAppointment][4] + " " + appointments[currentAppointment][3])
                                    .toLocaleDateString("vi-VN", {hour: "2-digit", minute: "2-digit"})}</p>
                                <p>{t('table.appointment-description')}: {appointments[currentAppointment][2]}</p>
                            </div>
                            <Button sx={{alignSelf: 'end', width: 'fit-content'}} variant={'contained'}
                                onClick={() => setCurrentAppointment(null)}
                            >{t('doctor.dashboard.quick-detail.close')}</Button>
                        </Stack>
                    }
                    <Stack>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} paddingBottom={1}>
                            <Input autoFocus placeholder={t('doctor.dashboard.filter.search-placeholder')}
                                   sx={{minWidth: '22rem'}} value={filter.query}
                                   onChange={(e) => {
                                        setFilter(prev => {
                                            return {...prev, query: e.target.value}
                                        })
                                    }}
                            />
                            <Stack direction={'row'} columnGap={'1rem'}>
                                <Stack rowGap={1}>
                                    <Stack direction={'row'} alignItems={'center'} columnGap={1}>
                                        <p>{t('doctor.dashboard.filter.status.title')}</p>
                                        {showAlert &&
                                            <Alert severity="warning"
                                                   sx={{fontSize: '0.9rem', padding: '0rem 1rem', width: 'fit-content'}}
                                            >
                                                {t('doctor.dashboard.filter.status.warning')}
                                            </Alert>
                                        }
                                    </Stack>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem'}}>
                                        <FormControlLabel control={<Checkbox sx={{marginRight: 1}} onChange={() => setFilter(prev => ({...prev, status: [1,1,1,1,1]}))}
                                                                             checked={filter.status.every(val => val === 1)}/>}
                                                          label={t('doctor.dashboard.filter.status.all')}
                                            disabled={filter.status.every(val => val === 1)}
                                        />
                                        {['done','cancelled','scheduled','confirmed','not-showed-up'].map((item, index) => {
                                            return (
                                                <FormControlLabel key={index}
                                                    control={<Checkbox sx={{marginRight: 1}} onChange={() => handleChangeStatus(index)}
                                                                       checked={filter.status.every(val => val === 1) || filter.status[index] === 1}/>}
                                                                  label={t(`doctor.dashboard.filter.status.${item}`)} />
                                            )
                                        })}
                                    </div>
                                </Stack>
                                <Stack direction={'row'} alignItems={'center'} columnGap={'1rem'}>
                                    <DatePicker format={"DD-MM-YYYY"} label={t('doctor.dashboard.filter.start-date')}
                                                onChange={(date) => setFilter(prev => ({...prev, startDate: date}))}
                                                sx={{width: '200px'}}
                                                slotProps={{
                                                    field: { clearable: true, onClear: () => setFilter(prev => ({...prev, startDate: null}))},
                                                }}
                                    />
                                    <DatePicker format={"DD-MM-YYYY"} label={t('doctor.dashboard.filter.end-date')} sx={{width: '200px'}}
                                                onChange={(date) => setFilter(prev => ({...prev, endDate: date}))}
                                                slotProps={{
                                                    field: { clearable: true, onClear: () => setFilter(prev => ({...prev, endDate: null}))},
                                                }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: '#36007B'}}>
                                        {header.map((item, index) =>
                                            <TableCell sx={{color: 'white'}} key={index}>
                                                <Stack className={'sortable-column'} direction={'row'} alignItems={'center'} columnGap={.5}
                                                    onClick={() => {
                                                        if(index === 0){
                                                            setSortOption(prev => ({...prev, id: prev.id === 1 ? -1 : 1}))
                                                        }
                                                        if(index === 1){
                                                            setSortOption(prev => ({...prev, name: prev.name === 1 ? -1 : 1}))
                                                        }
                                                        if(index === 3) {
                                                            setSortOption(prev => ({...prev, time: prev.time === 1 ? -1 : 1}))
                                                        }
                                                    }}
                                                >
                                                    {t(`table.${item}`)}
                                                    {(index === 0 || index === 1 || index === 3) &&
                                                        <ImportExportIcon className={'sortable'} sx={{color: 'yellow'}}/>
                                                    }
                                                </Stack>
                                            </TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterAppointments && filterAppointments.map((item, index) => (
                                        <Tooltip title={t('table.view-detail')} key={index} followCursor
                                                 onClick={() => {
                                                     staffAxios.get('/appointment/detail?appointmentID=' + item[0])
                                                         .then(r => {
                                                             setCurrentDetail(r.data)
                                                             setOpenDetail(true)
                                                         })
                                                         .catch(() => alert(t('doctor.dashboard.no-prescription')))
                                                 }}>
                                            <TableRow className={['0','1','3'].includes(index) ? 'sortable-column' : ''} sx={{
                                                '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                                '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                            }}>
                                                <TableCell>{item[0]}</TableCell>
                                                <TableCell>{item[6] + " " + item[5]}</TableCell>
                                                <TableCell>{item[9]} {item[10]}, {item[11]}, {item[12]}</TableCell>
                                                <TableCell>{new Date(item[4] + " " + item[3]).toLocaleDateString("vi-VN", {hour: "2-digit", minute: "2-digit"})}</TableCell>
                                                <TableCell>{item[2]}</TableCell>
                                                <TableCell>
                                                    <p style={{padding: '0.25rem .5rem',
                                                        backgroundColor: statusBadgeBgColor[item[14]],
                                                        color: statusBadgeTextColor[item[14]],
                                                        width: 'fit-content',
                                                        borderRadius: '0.3rem', fontSize: '0.6rem'
                                                    }}
                                                    >
                                                        {t(`doctor.dashboard.filter.status.${item[14].toLowerCase()}`)}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                    ))}
                                </TableBody>
                            </Table>
                            <Stack alignSelf={'center'} marginTop={1} direction={'row'} justifyContent={'center'} columnGap={2}>
                                <Pagination count={pagination.totalRecord} color={'primary'} page={pagination.page}
                                            onChange={(_, page) => {
                                                setFilter(prev => ({...prev, status: [1,1,1,1,1]}))
                                                setPagination(prev => ({...prev, page: page}))
                                            }}/>
                            </Stack>
                        </TableContainer>
                        {filterAppointments && filterAppointments.length === 0 &&
                            <Stack sx={{width: '100%', height: '15rem', justifyContent: 'center', alignItems: 'center', fontSize: '2rem'}}>
                                <p>{t('doctor.dashboard.no-appointment')}</p>
                            </Stack>
                        }
                    </Stack>
                </Stack>
            </div>
            <Dialog fullScreen open={openDetail} onClose={() => setOpenDetail(false)}>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => {
                                setOpenDetail(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1, fontSize: '20px', fontWeight: 'bold'}}>
                            {t('prescription.detail.title', {ns: 'common'})}
                        </Typography>
                        <Stack direction={'row'} columnGap={1}>
                            <Button variant="contained" color={'secondary'} startIcon={<LocalPrintshopIcon/>} onClick={handlePrint}>
                                {t('prescription.btn.print')}
                            </Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {currentDetail &&
                    <Stack sx={{paddingBlock: '20px'}} rowGap={1} ref={printRef}>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>{t('prescription.patient-info.title')}</p>
                            <div className={'prescription-detail-patient-info'}>
                                <p>{t('prescription.patient-info.name')}: <b>{currentDetail['name']}</b></p>
                                <p>{t('prescription.patient-info.dob')}: <b>{dayjs(currentDetail['dateOfBirth']).format("DD-MM-YYYY")}</b></p>
                                <p>{t('prescription.patient-info.phone')}: <b>{currentDetail['phoneNumber'] ? currentDetail['phoneNumber'] : '---'}</b></p>
                                <p>{t('prescription.patient-info.address')}: <b>{currentDetail['address']}</b></p>
                            </div>
                        </Stack>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>{t('prescription.detail.title')}</p>
                            <Stack>
                                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'red'}}>{t('prescription.detail.diagnosis')}
                                    <p className={'doctor-diagnosis'}>{currentDetail['diagnosis']}</p>
                                </div>
                            </Stack>
                            <Stack>
                                <p style={{color: 'red', fontWeight: 'bold', fontSize: '1.25rem'}}>
                                    {t('prescription.detail.p-medications', {total: currentDetail.medicationList.length})}
                                </p>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                                {medicationHeader.map((item, index) =>
                                                    <TableCell sx={{color: 'white'}} key={index}>{t(`table.${item}`)}</TableCell>)}
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
        </div>
    )
}