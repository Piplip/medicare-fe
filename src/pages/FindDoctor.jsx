import '../styles/find-a-doctor-style.css'
import {Button, FormControlLabel, Pagination, Skeleton, Stack, Typography} from "@mui/material";
import Input from "@mui/material/Input";
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from "@mui/material/Checkbox";
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../config/FirebaseConfig.jsx";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import baseAxios from "../config/axiosConfig.jsx";
import DefaultImage from '../assets/default.jpg'
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router";


export default function FindDoctor(props){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const {t} = useTranslation(['findDoctor', 'common'])
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [showMain, setShowMain] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [enableMoreFilters, setEnableMoreFilters] = useState(false)

    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery"]
    const availableLanguage = ['en', 'es', 'fr', 'zh', 'ko', 'de', 'it', 'ja', 'vi']
    const specialties = [
        "Allergy and Immunology", "Anesthesiology", "Cardio thoracic Surgery", "Cardiology", "Cardiovascular Disease",
        "Colon and Rectal Surgery", "Dermatology", "Emergency Medicine", "Endocrinology", "ENT (Ear, Nose, and Throat)", "Gastroenterology", "Geriatrics",
        "Hematology/Oncology", "Infectious Diseases", "Internal Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynecology", "Oncology",
        "Orthopedic Surgery", "Orthopedics", "Pathology", "Pediatrics", "Physical Medicine and Rehabilitation",
        "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Sports Medicine", "Surgery", "Urology", "Vascular Surgery"
    ]

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
            console.log(res.data)
            setDoctorData(res.data.records)
            setIsLoading(false)
            setShowMain(true)

            for (let i = 0; i < res.data.records.length; i++) {
                let storageRef = ref(storage, res.data.records[i][2])
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

    const location = useLocation()

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
                    <Stack rowGap={3} color={'white'}>
                        <p className={'clear-filter-btn'} onClick={clearFilters}>{t('clear-filter')}</p>
                        <Stack rowGap={1}>
                            <Typography variant={'body2'}>{t('department.title', {ns: 'common'}).toUpperCase()}</Typography>
                            <Select onChange={handleSelectChange} value={searchData.department} disabled={isLoading}>
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
                            <Typography variant={'body2'}>{t('speciality.title', {ns: 'common'}).toUpperCase()}</Typography>
                            <Select onChange={handleSelectChange} value={searchData.specialization} disabled={isLoading}>
                                <Option value="default"
                                        onClick={() => handleSelectChange('specialization', 'default')}
                                >{t(`speciality.default`, {ns: 'common'})}</Option>
                                {specialties.map((speciality, index) => (
                                    <Option value={speciality} key={index}
                                            onClick={() => handleSelectChange('specialization', speciality)}
                                    >
                                        {t(`speciality.${speciality}`, {ns: 'common'})}</Option>
                                ))}
                            </Select>
                        </Stack>
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
                                <Select defaultValue={10} onChange={handleSelectChange}>
                                    <Option select-type={'pageSize'} value={10}>10</Option>
                                    <Option select-type={'pageSize'} value={15}>15</Option>
                                    <Option select-type={'pageSize'} value={20}>20</Option>
                                </Select>
                            </Stack>
                        </Stack>
                        <div className={'provider-search-result-container'}>
                            {doctorData.map((doctor, index) => (
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
                                                    <StarIcon color={'warning'}/>
                                                    <StarIcon color={'warning'}/>
                                                    <StarIcon color={'warning'}/>
                                                    <StarIcon color={'warning'}/>
                                                    <StarIcon/>
                                                    <p style={{marginLeft: '0.5rem'}}>4.8 out of 5</p>
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
                                    <Button variant={'contained'} sx={{width: 'fit-content'}}
                                        onClick={() => schedule(doctor)}
                                    >{location.pathname.includes('/none/find-a-doctor') ? t('schedule-2') : t('schedule')}</Button>
                                </div>
                            ))}
                            <Pagination page={searchData.pageNumber} sx={{alignSelf: 'center', backgroundColor: 'white', padding: '0.25rem 1rem'}} count={10} color="primary"
                                onChange={(_, page) => setSearchData(prev => ({...prev, pageNumber: page}))}
                            />
                        </div>
                    </Stack>
                </div> :
                <div style={{display: 'flex', flexDirection: 'column', rowGap: '1rem'}}>
                    <p className={'more-filter-btn'} onClick={() => setEnableMoreFilters(prev => !prev)}>
                        {enableMoreFilters ? t('less-filter') : t('more-filter')}
                    </p>
                    {enableMoreFilters &&
                        <div className={'more-filter-panel'} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem'}}>
                            <Stack rowGap={1}>
                                <Typography variant={'body2'}>{t('department.title', {ns: 'common'}).toUpperCase()}</Typography>
                                <Select onChange={handleSelectChange} value={searchData.department} disabled={isLoading}>
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
                                <Typography variant={'body2'}>{t('speciality.title', {ns: 'common'}).toUpperCase()}</Typography>
                                <Select onChange={handleSelectChange} value={searchData.specialization} disabled={isLoading}>
                                    <Option value="default"
                                            onClick={() => handleSelectChange('specialization', 'default')}
                                    >{t(`speciality.default`, {ns: 'common'})}</Option>
                                    {specialties.map((speciality, index) => (
                                        <Option value={speciality} key={index}
                                                onClick={() => handleSelectChange('specialization', speciality)}
                                        >
                                            {t(`speciality.${speciality}`, {ns: 'common'})}</Option>
                                    ))}
                                </Select>
                            </Stack>
                        </div>
                    }
                </div>
            }
            <Typography variant={'body2'} color={'black'}>
                {t('note')}
            </Typography>
        </div>
    )
}