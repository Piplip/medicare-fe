import '../../styles/find-a-doctor-style.css'
import {Button, FormControlLabel, Pagination, Skeleton, Stack, Typography} from "@mui/material";
import Input from "@mui/material/Input";
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from "@mui/material/Checkbox";
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import baseAxios from "../../config/axiosConfig.jsx";
import DefaultImage from '../../assets/default.jpg'
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router";
import DepartmentSpecializationFilter from "../../components/DepartmentSpecializationFilter.jsx";
import InfoIcon from '@mui/icons-material/Info';
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload.js";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {deparment, specialties} from "../../App.jsx";

export default function FindDoctor(props){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const {t} = useTranslation(['findDoctor', 'common'])
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [showMain, setShowMain] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [enableMoreFilters, setEnableMoreFilters] = useState(false)

    const availableLanguage = ['en', 'es', 'fr', 'zh', 'ko', 'de', 'it', 'ja', 'vi']

    const [openDetail, setOpenDetail] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectDoctorStatistic, setSelectDoctorStatistic] = useState(null)
    const [doctorData, setDoctorData] = useState([])
    const [queryName, setQueryName] = useState(searchParams.get('name') || '')
    const [searchData, setSearchData] = useState({
        department: searchParams.get('department') || 'default',
        language: searchParams.get('language') || 'default',
        specialization: searchParams.get('specialization') || 'default',
        gender: searchParams.get('gender') || '',
        pageSize: parseInt(searchParams.get('pageSize')) || 10,
        pageNumber: parseInt(searchParams.get('pageNumber')) || 1
    })
    const [totalPage, setTotalPage] = useState(null)
    const location = useLocation()

    useEffect(() => {
        if(showMain || searchParams.get('name') || searchParams.get('department') || searchParams.get('language')
            || searchParams.get('specialization') || searchParams.get('gender') || searchParams.get('pageNumber')){
            fetchStaffData()
        }
    }, [searchData, searchParams]);

    function handleQueryChange(e){
        if(searchData.pageNumber !== 1) {
            setSearchData(prev => ({...prev, pageNumber: 1}))
        }
        setQueryName(e.target.value)
    }

    function handleSelectChange(type, value){
        if(searchData.pageNumber !== 1){
            setSearchData(prev => ({...prev, pageNumber: 1}))
        }
        setSearchData(prev => {
            return {...prev, [type]: value}
        })
    }

    function fetchStaffData(){
        setIsLoading(true)
        let subParams = {}
        for(let key in searchData){
            if(searchData[key] !== 'default' && searchData[key] !== ''){
                subParams[key] = searchData[key]
            }
        }
        setSearchParams(subParams)
        const params = new URLSearchParams({
            name: queryName,
            department: searchData.department,
            "primary-language": searchData.language,
            specialization: searchData.specialization,
            gender: searchData.gender,
            "page-size": searchData.pageSize,
            "page-number": searchData.pageNumber
        }).toString()

        baseAxios.get('/staff?' + params)
        .then(async res => {
            setTotalPage(parseInt(res?.data[0], 10))
            const data = JSON.parse(res?.data[1])['records']
            setDoctorData(data)
            setIsLoading(false)
            setShowMain(true)

            for (let i = 0; i < data.length; i++) {
                let storageRef = ref(storage, data[i][2])
                await getDownloadURL(storageRef)
                    .then(url => {
                        setDoctorData(prev => {
                            const updatedData = [...prev];
                            updatedData[i][2] = url;
                            return updatedData;
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        setDoctorData(prev => {
                            const updatedData = [...prev];
                            updatedData[i][2] = DefaultImage;
                            return updatedData;
                        })
                    })
            }
        })
        .catch(err => console.log(err))
    }

    function clearFilters(){
        setSearchData({
            department: 'default',
            language: 'default',
            specialization: 'default',
            gender: '',
            pageSize: 10,
            pageNumber: 1
        })
    }

    function schedule(doctor){
        if(location.pathname.includes("none")){
            props.setAppointmentData(prev => ({
                ...prev,
                doctor: {
                    doctorID: doctor[0],
                    name: doctor[4] + " " + doctor[5],
                    phone: doctor[6],
                    department: doctor[9],
                    specialization: doctor[11],
                    language: doctor[8],
                    image: doctor[2],
                    'specialization-detail': doctor[12]
                }
            }))
            props.goNextStep()
        }
        else navigate(`/schedule/${doctor[0]}/info`)
    }

    return (
        <div className={'find-provider-container'}
             style={{paddingInline: location.pathname.includes("/schedule") ? '5%' : '10%'}}>
            <div className={'search-input'}>
                <Input
                    disabled={isLoading}
                    onChange={handleQueryChange}
                    value={queryName}
                    sx={{
                        backgroundColor: 'white',
                        padding: '0.25rem 0.5rem',
                        fontSize: '1.2rem'
                    }}
                    placeholder={t('name-placeholder')} fullWidth/>
                <Button sx={{paddingInline: 2, borderRadius: 1, width: '8rem'}} size={'small'} variant="contained" startIcon={<SearchIcon />}
                    onClick={fetchStaffData} disabled={isLoading}
                >
                    {t('find-button')}
                </Button>
            </div>
            {showMain ?
                <div className={'find-provider-main'}>
                    <Stack className={'main-filter'} rowGap={3} color={'white'}>
                        <p className={'clear-filter-btn'} onClick={clearFilters}>{t('clear-filter')}</p>
                        <DepartmentSpecializationFilter isLoading={isLoading} handleSelectChange={handleSelectChange} searchData={searchData}/>
                        <Stack rowGap={1}>
                            <Typography variant={'body2'}>{t('primary-lang')}</Typography>
                            <Select onChange={handleSelectChange} value={searchData.language} disabled={isLoading}>
                                <Option select-type={'language'} value="default"
                                        onClick={() => handleSelectChange('language', 'default')}
                                >{t('lang.default', {ns: 'common'})}</Option>
                                {availableLanguage.map((language, index) => (
                                    <Option select-type={'language'} value={language} key={index}
                                            onClick={() => handleSelectChange('language', language)}
                                    >{t(`lang.${language}`, {ns: 'common'})}</Option>
                                ))}
                            </Select>
                        </Stack>
                        <Stack>
                            <Typography variant={'body2'}>{t('gender.title')}</Typography>
                            <Stack direction={'row'}>
                                <FormControlLabel control={<Checkbox onChange={() => setSearchData(prev => ({...prev, gender: 'Male'}))}
                                                                     checked={searchData.gender === 'Male'} sx={{
                                    color: 'greenyellow',
                                    '&.Mui-checked': {
                                        color: 'greenyellow',
                                    },
                                }}/>} label={t('gender.male')} disabled={isLoading}/>
                                <FormControlLabel control={<Checkbox onChange={() => setSearchData(prev => ({...prev, gender: 'Female'}))}
                                                                     checked={searchData.gender === 'Female'} sx={{
                                    color: 'greenyellow',
                                    '&.Mui-checked': {
                                        color: 'greenyellow',
                                    },
                                }}/>} label={t('gender.female')} disabled={isLoading}/>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack rowGap={'1rem'} style={{backgroundColor: '#1a3536', color: 'white'}} padding={2}>
                        <Stack direction={'row'} paddingBlock={1}>
                            <Typography sx={{flexGrow: 1}} variant={'h4'} color={'yellow'} textAlign={'center'}>
                                {isLoading
                                    ? <Skeleton variant={'text'}/>
                                    : t('number-of-doctor', {count: doctorData.length})
                                }
                            </Typography>
                            <Stack direction={'row'} alignItems={'center'} columnGap={2} color={'white'}>
                                <Typography variant={'body1'}>{t('row-per-page')}</Typography>
                                <Select value={searchData.pageSize} defaultValue={10} onChange={(_, val) => handleSelectChange('pageSize', val)}>
                                    <Option select-type={'pageSize'} value={10}>10</Option>
                                    <Option select-type={'pageSize'} value={15}>15</Option>
                                    <Option select-type={'pageSize'} value={20}>20</Option>
                                </Select>
                            </Stack>
                        </Stack>
                        <div className={'provider-search-result-container'}>
                            {doctorData && doctorData.length !== 0 ?
                                doctorData.map((doctor, index) => (
                                    <div key={index} className={'provider-card'}>
                                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{color: 'cyan'}}>
                                            <Typography variant={'h6'}>
                                                {isLoading
                                                    ? <Skeleton variant={'text'}/>
                                                    : doctor[4] + " " + doctor[5]
                                                }
                                            </Typography>
                                            <Typography variant={'h6'}>
                                                {isLoading
                                                    ? <Skeleton variant={'text'} />
                                                    : doctor[6]
                                                }
                                            </Typography>
                                        </Stack>
                                        <Stack direction={'row'} columnGap={5}>
                                            {
                                                (doctor[2].length < 15 && doctor[2] !== DefaultImage)
                                                    ? <Skeleton variant={'rectangular'} height={'12rem'} width={'12rem'}/>
                                                    : <img alt={""} className={'provider-image'} src={doctor[2]}/>
                                            }
                                            <div className={'provider-info'}>
                                                <div>
                                                    <Stack direction={'row'}>
                                                        {Array(5).fill(null).map((_, index) => {
                                                            return (
                                                                <StarIcon key={index} color={index <= 3 ? 'warning' : ''}/>
                                                            )
                                                        })}
                                                        <p style={{marginLeft: '0.5rem'}}>4.1</p>
                                                    </Stack>
                                                    <p>293 Patient Satisfaction Ratings</p>
                                                    <p>45 Patients give comments</p>
                                                </div>
                                                <Stack spacing={1.25}>
                                                    <Stack>
                                                        <Typography variant={'body1'}>{t('department')}</Typography>
                                                        <p>
                                                            {isLoading
                                                                ? <Skeleton variant={'text'}/>
                                                                : t(`department.${doctor[9]}`, {ns: 'common'})
                                                            }
                                                        </p>
                                                    </Stack>
                                                    <Stack>
                                                        <Typography variant={'body1'}>{t('specialization')}</Typography>
                                                        <div className={'specialization-wrapper'}
                                                             style={{position: 'relative', width: 'fit-content'}}>
                                                            <Stack direction={'row'} alignItems={'center'}>
                                                                <p>
                                                                    {isLoading
                                                                        ? <Skeleton variant={'text'}/>
                                                                        : t(`speciality.${doctor[11]}`, {ns: 'common'})
                                                                    }
                                                                    <span className={'more-info-tag'}>?</span>
                                                                </p>
                                                                <div className={'more-info-content'}>{doctor[12]}</div>
                                                            </Stack>
                                                        </div>
                                                    </Stack>
                                                    <Stack>
                                                        <Typography variant={'body1'}>{t('language-spoken')}</Typography>
                                                        <p>
                                                            {isLoading
                                                                ? <Skeleton variant={'text'}/>
                                                                : t(`lang.${doctor[8]}`, {ns: 'common'})
                                                            }
                                                        </p>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                        <Stack direction={'row'} columnGap={1}>
                                            <Button variant={'contained'} sx={{width: 'fit-content'}}
                                                    onClick={() => schedule(doctor)}
                                            >
                                                {location.pathname.includes('/none/find-a-doctor') ? t('schedule-2') : t('schedule')}
                                            </Button>
                                            <Button variant={'contained'} startIcon={<InfoIcon />}
                                                    onClick={() => {
                                                        baseAxios.get(`/doctor/${doctor[0]}/statistic`)
                                                            .then(r => {
                                                                setSelectDoctorStatistic(r.data)
                                                            }).catch(err => console.log(err))
                                                        setSelectedDoctor(index)
                                                        setOpenDetail(true)
                                                    }}
                                            >
                                                {t('doctor-more-info')}
                                            </Button>
                                        </Stack>
                                    </div>
                                ))
                                :
                                <div className={'empty-table'}>
                                    {t('no-doctor')}
                                </div>
                            }
                            {(doctorData && doctorData.length !== 0 && totalPage) ?
                                <Pagination page={searchData.pageNumber} sx={{alignSelf: 'center', backgroundColor: 'white', padding: '0.25rem 1rem'}}
                                            count={totalPage} color="primary"
                                            onChange={(_, page) => setSearchData(prev => ({...prev, pageNumber: page}))}
                                /> : <></>
                            }
                        </div>
                    </Stack>
                </div> :
                <div style={{display: 'flex', flexDirection: 'column', rowGap: '1rem'}}>
                    <p className={'more-filter-btn'} onClick={() => setEnableMoreFilters(prev => !prev)}>
                        {enableMoreFilters ? t('less-filter') : t('more-filter')}
                    </p>
                    {enableMoreFilters &&
                        <div className={'more-filter-panel'} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem'}}>
                            <DepartmentSpecializationFilter isLoading={isLoading} handleSelectChange={handleSelectChange} searchData={searchData}/>
                        </div>
                    }
                </div>
            }
            <Typography variant={'body2'} color={'black'}>
                {t('note')}
            </Typography>
            {selectedDoctor !== null &&
                <Modal open={openDetail} onClose={() => {
                    setOpenDetail(false)
                }}>
                    <ModalDialog sx={{paddingBlock: 1, width: 'fit-content'}}>
                        <Stack borderBottom={'1px solid'}>
                            <Typography
                                variant={'h5'}>{doctorData[selectedDoctor][4]} {doctorData[selectedDoctor][5]}</Typography>
                            <ModalClose/>
                        </Stack>
                        <Stack direction={'row'} columnGap={3} sx={{overflowY: 'auto'}}>
                            <Stack >
                                <p className={'staff-detail-section-title'}>
                                    {t('user-management.modal.staff-detail.pp.title', {ns: 'admin'})}
                                </p>
                                <img src={doctorData[selectedDoctor][2]} alt={'doctor profile'} width={'250px'}/>
                            </Stack>
                            <Stack sx={{overflowY: 'auto'}}>
                                <p className={'staff-detail-section-title'}>
                                    {t('user-management.modal.staff-detail.personal-info.title', {ns: 'admin'})}
                                </p>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.lname', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{doctorData[selectedDoctor][4]}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.fname', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{doctorData[selectedDoctor][5]}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.phone', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{doctorData[selectedDoctor][6]}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.gender', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{t(`gender.${doctorData[selectedDoctor][7]}`, {ns: 'common'})}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.primary-lang', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{t(`${doctorData[selectedDoctor][8]}`, {ns: 'common'})}</p>
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack>
                                <p className={'staff-detail-section-title'}>
                                    {t('user-management.modal.staff-detail.staff-info.title', {ns: 'admin'})}
                                </p>
                                <Stack rowGap={1}>
                                    {selectDoctorStatistic &&
                                        <>
                                            <div className={'personal-details-item'}>
                                                <p className={'personal-details-item-title'}>{t('table.work-years', {ns: 'common'})}</p>
                                                <p className={'personal-details-item-content'}>
                                                    {t('work-year', {year: selectDoctorStatistic['workYears'].split('-')[0],
                                                        month: selectDoctorStatistic['workYears'].split('-')[1], ns: 'findDoctor'})}
                                                </p>
                                            </div>
                                            <div className={'personal-details-item'}>
                                                <p className={'personal-details-item-title'}>{t('table.total-appointment', {ns: 'common'})}</p>
                                                <p className={'personal-details-item-content'}>{selectDoctorStatistic['totalAppointment']}</p>
                                            </div>
                                            <div className={'personal-details-item'}>
                                                <p className={'personal-details-item-title'}>{t('table.total-patient', {ns: 'common'})}</p>
                                                <p className={'personal-details-item-content'}>{selectDoctorStatistic['totalPatient']}</p>
                                            </div>
                                        </>
                                    }
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.staff-type-2', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{t(`staff-type.${doctorData[selectedDoctor][13]}`, {ns: 'common'})}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.department', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{t(`department.${doctorData[selectedDoctor][9]}`, {ns: 'common'})}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}> {t('table.specialization', {ns: 'common'})}</p>
                                        <p className={'personal-details-item-content'}>{t(`speciality.${doctorData[selectedDoctor][11]}`, {ns: 'common'})}</p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            }
        </div>
    )
}