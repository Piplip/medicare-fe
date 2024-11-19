import "../../styles/admin-user-management-style.css"
import AddIcon from '@mui/icons-material/Add';
import {
    Button,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TableTemplate from "../../components/root/TableTemplate.jsx";
import {useLoaderData, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {adminAxios} from "../../config/axiosConfig.jsx";
import {Tabs} from "@mui/material";
import {Modal, ModalDialog} from "@mui/joy";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import Input from '@mui/joy/Input';
import DepartmentSpecializationFilter from "../../components/DepartmentSpecializationFilter.jsx";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import StaffModifyTemplate from "../../components/StaffModifyTemplate.jsx";
import SimpleTableTemplate from "../../components/SimpleTableTemplate.jsx";
import {useTranslation} from "react-i18next";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import UnauthenticatedModal from "../../components/UnauthenticatedModal.jsx";

export default function AdminUserManagement(){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const {t} = useTranslation('admin')
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const loaderData = useLoaderData()
    const [staffData, setStaffData] = useState(loaderData !== null && JSON.parse(loaderData.data[1])['records'])
    const [sortedStaffData, setSortedStaffData] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const tableHeader = ['id', 'lname', 'fname', 'phone', 'gender', 'department', 'specialization', 'staff-type', 'email', 'status']
    const [searchParams, setSearchParams] = useSearchParams()
    const [successCreatedStaffData, setSuccessCreatedStaffData] = useState([])
    const [failedCreatedStaffData, setFailedCreatedStaffData] = useState([])
    const [queryName, setQueryName] = useState(searchParams.get('name') || '')
    const [currentModifyData, setCurrentModifyData] = useState([])
    const [viewMode, setViewMode] = useState(0)
    const [deleteReason, setDeleteReason] = useState("")
    const [searchData, setSearchData] = useState({
        department: searchParams.get('department') || 'default',
        language: searchParams.get('language') || 'default',
        specialization: searchParams.get('specialization') || 'default',
        gender: searchParams.get('gender') || '',
        pageSize: parseInt(searchParams.get('pageSize')) || 10,
        pageNumber: parseInt(searchParams.get('pageNumber')) || 1,
        type: searchParams.get('type') || '',
        status: searchParams.get('status') || 'default',
    })
    const [totalPage, setTotalPage] = useState(parseInt(loaderData?.data[0], 10))
    const navigate = useNavigate()
    const [sortOption, setSortOption] = useState({
        orderBy: 'id',
        order: 'asc'
    })
    const [showFilters, setShowFilters] = useState(false)

    const handleChangeViewMode = (event, newValue) => {
        setViewMode(newValue)
    };

    const successStaffHeader = ['account-id', 'staff-id', 'fname', 'lname', 'dob', 'id-number', 'phone', 'email', 'password', 'role']
    const successDataKey = ['accountID', 'staffID', 'firstname', 'lastname', 'dateOfBirth', 'cccd', 'phoneNumber', 'email', 'password', 'role']
    const failedStaffHeader = ['fname', 'lname', 'dob', 'id-number', 'phone', 'email', 'password', 'result-type']
    const failedDataKey = ['firstname', 'lastname', 'dateOfBirth', 'cccd', 'phoneNumber', 'email', 'password', 'resultType']

    useEffect(() => {
        fetchStaffData()
    }, [searchData]);
    useEffect(() => {
        if(staffData){
            const sortedData = [...staffData]
            let sortIndex = sortOption.orderBy === 'id' ? 0 : sortOption.orderBy === 'lname' ? 1 : 2
            sortedData.sort((a, b) => {
                if(sortOption.order === 'asc'){
                    return a[sortIndex] > b[sortIndex] ? 1 : -1
                } else {
                    return a[sortIndex] < b[sortIndex] ? 1 : -1
                }
            })
            setSortedStaffData(sortedData)
        }
    }, [sortOption, staffData]);

    function handleQueryChange(e){
        if(searchData.pageNumber !== 1) {
            setSearchData(prev => ({...prev, pageNumber: 1}))
        }
        setQueryName(e.target.value)
    }

    function fetchStaffData(){
        let subParams = {}
        for(let key in searchData){
            if(searchData[key] !== 'default' && searchData[key] !== ''){
                subParams[key] = searchData[key]
            }
        }
        if(queryName !== ''){
            subParams['q'] = queryName
        }
        setSearchParams(subParams)

        const params = new URLSearchParams({
            name: queryName,
            department: searchData.department,
            "primary-language": searchData.language,
            specialization: searchData.specialization,
            gender: searchData.gender,
            "page-size": searchData.pageSize,
            "page-number": searchData.pageNumber,
            "staff-type": searchData.type,
            "staff-status": searchData.status
        }).toString()

        adminAxios.get('/staff?' + params)
            .then(async res => {
                setStaffData(JSON.parse(res?.data[1])['records'])
                setTotalPage(parseInt(res?.data[0], 10))
            })
            .catch(err => console.log(err))
    }

    function handleSelectChange(type, value){
        if(searchData.pageNumber !== 1){
            setSearchData(prev => ({...prev, pageNumber: 1}))
        }
        setSearchData(prev => {
            return {...prev, [type]: value}
        })
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds the maximum limit (10MB).');
            return;
        }

        setSelectedFile(file);
    }

    async function generateStaffData(){
        if(!selectedFile){
            alert('Please select a file to upload')
            return
        }
        setIsLoading(true)
        const storageRef = ref(storage, `/staff data/${selectedFile.name}`)
        const uploadTask = await uploadBytes(storageRef, selectedFile)
        const downloadURL = await getDownloadURL(uploadTask.ref);
        const encodedURL = encodeURIComponent(downloadURL);
        const targetURL = `/staff/add?url=${encodedURL}`

        adminAxios.post(targetURL)
            .then(async r => {
                setIsLoading(false)
                const successData = r.data.filter(item => item.resultType === 1)
                const failedData = r.data.filter(item => item.resultType !== 1)
                setSuccessCreatedStaffData(successData)
                setFailedCreatedStaffData(failedData)
            })
            .catch(e => console.log(e))
    }

    function clearFilters(){
        setSearchData(prev => ({
            ...prev,
            department: 'default',
            language: 'default',
            specialization: 'default',
            gender: '',
            pageSize: 10,
            type: ''
        }))
        setSortOption({
            orderBy: 'id',
            order: 'asc'
        })
    }
    function deleteStaff(index){
        setDeleteReason("")
        adminAxios.delete('/staff/delete?id=' + staffData[index][0] + "&note=" + deleteReason)
            .then(res => {
                alert(res.data)
                fetchStaffData()
            })
            .catch(err => console.log(err))
    }

    function handleModify(id){
        adminAxios.get('/staff/get?id=' + id)
            .then(r => {
                setCurrentModifyData(r.data.records[0])
            })
            .catch(err => console.log(err))
    }

    console.log(loaderData)

    return (
        <div className={'user-management-container'}>
            {loaderData === null &&
                <Modal open={true}>
                    <ModalDialog>
                        <Stack rowGap={2}>
                            <Typography textAlign={'center'} variant={'h4'} color={'red'}>WARNING: UNAUTHORIZED ACCESS</Typography>
                            <Typography variant={'h6'}>
                                You are not authorized to view this page. Please log in or switch to an authorized account.
                            </Typography>
                        </Stack>
                        <Button variant={'contained'} color={'primary'} onClick={() => {
                            navigate('/staff/login')
                        }}>LOG IN / SWITCH ACCOUNT</Button>
                    </ModalDialog>
                </Modal>
            }
            <Modal aria-labelledby="modal-title" aria-describedby="modal-desc"
                   open={openModal}
                   onClose={() => setOpenModal(false)}
                   sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Stack sx={{ minWidth: 800, maxHeight: 600, backgroundColor: '#F0F4F8', padding: '1rem 1.25rem', overflowY: 'auto'
                    , boxShadow: '1rem 1rem green'}} rowGap={'1rem'}>
                    <Typography variant={'h4'} textAlign={'center'} borderBottom={'3px solid'}>
                        {t('user-management.modal.adding-staff.title')}
                    </Typography>
                    {(successCreatedStaffData.length !== 0 || failedCreatedStaffData.length !== 0) ?
                        <Stack rowGap={2}>
                            <Typography textAlign={'center'} variant={'h5'} color={"green"}>{t('user-management.modal.adding-staff.success')}</Typography>
                            <Tabs value={viewMode} onChange={handleChangeViewMode}>
                                <Tab label={t('user-management.modal.adding-staff.text.success', {count: successCreatedStaffData.length})}/>
                                <Tab label={t('user-management.modal.adding-staff.text.failed', {count: failedCreatedStaffData.length})}/>
                            </Tabs>
                            {viewMode === 0 ?
                                <SimpleTableTemplate header={successStaffHeader} data={successCreatedStaffData} keys={successDataKey}/>
                                :
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                                {failedStaffHeader.map((item, index) => (
                                                    <TableCell sx={{color: 'white', userSelect: 'none'}} key={index}>
                                                        {t(`table.${item}`, {ns: 'common'})}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        {failedCreatedStaffData.length > 0 &&
                                            <TableBody>
                                                {
                                                    failedCreatedStaffData.map((item, index) => (
                                                        <TableRow key={index} sx={{
                                                            '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                                            '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                                        }}>
                                                            {failedDataKey.map((key, index) => (
                                                                (item[key] !== null && item[key] !== undefined) ?
                                                                    <TableCell key={index} sx={{color: key === 'resultType' ? '#ff0f00' : ''}}>
                                                                        {key === 'resultType' ?
                                                                            t(`result-type.${item[key]}`, {ns: 'common'}) ||  <CloseOutlinedIcon sx={{color: 'red'}}/>
                                                                            :
                                                                            item[key] || <CloseOutlinedIcon sx={{color: 'red'}}/>
                                                                        }
                                                                    </TableCell>
                                                                    :
                                                                    <TableCell key={index}></TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        }
                                    </Table>
                                </TableContainer>
                            }
                            <Stack direction={'row'} alignSelf={'end'} columnGap={1}>
                                <Button variant={'contained'} onClick={() => {
                                    setSuccessCreatedStaffData([])
                                    setFailedCreatedStaffData([])
                                    setOpenModal(false)
                                }}>{t('user-management.modal.adding-staff.button.finish-review')}</Button>
                                <Button variant={'contained'} color={'warning'} onClick={() => {
                                    setSuccessCreatedStaffData([])
                                    setFailedCreatedStaffData([])
                                }}>{t('user-management.modal.adding-staff.button.generate-new')}</Button>
                            </Stack>
                        </Stack>
                        :
                        <>
                            <div>
                                <input type={'file'} onChange={handleFileSelect}/>
                            </div>
                            <Button variant={'contained'} type={'submit'} onClick={generateStaffData} disabled={isLoading}
                                    sx={{backgroundColor: '#295457', marginBlock: '1rem',
                                        color: 'white',
                                        '&:hover': {backgroundColor: '#1b3c3f'
                                        }}}
                            >
                                {isLoading ? <div className={'loader'}></div> :
                                    t('user-management.modal.adding-staff.button.upload')
                                }
                            </Button>
                        </>
                    }
                </Stack>
            </Modal>
            <Stack direction={'row'} alignItems={'center'} spacing={1} fontSize={'1.1rem'}>
                <h1>{t('user-management.title', {count: 232})}</h1>
                <AddIcon style={{backgroundColor: '#00D1FF', borderRadius: '50%', color: 'white',}} onClick={() => setOpenModal(true)}/>
            </Stack>
            <section className={'user-table-container'}>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       className={'table-filters'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input autoFocus placeholder={t('user-management.filter.search-placeholder')}
                               sx={{minWidth: '25rem'}} value={queryName} onChange={handleQueryChange}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    fetchStaffData()
                                }
                            }}
                        />
                        <Button variant={'contained'} onClick={fetchStaffData}>
                            {t('user-management.button.find')}
                        </Button>
                    </Stack>
                    <Button variant="contained" startIcon={<FilterAltIcon />} onClick={() => setShowFilters(prev => !prev)}>
                        {t('user-management.button.sort-filter')}
                    </Button>
                </Stack>
                {showFilters &&
                    <Stack>
                        <Stack rowGap={2} className={'sort-filter-panel'}>
                            <p className={'clear-filter-btn'} onClick={clearFilters}>
                                {t('user-management.button.clear')}
                            </p>
                            <Stack direction={'row'} columnGap={3}>
                                <DepartmentSpecializationFilter isLoading={isLoading} searchData={searchData}
                                                                handleSelectChange={handleSelectChange}/>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>
                                        {t('user-management.filter.gender.title')}
                                    </Typography>
                                    <Select value={searchData.gender} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, gender: value}
                                    })}>
                                        <Option value={''}>{t('user-management.filter.gender.default')}</Option>
                                        <Option value={'male'}>{t('user-management.filter.gender.male')}</Option>
                                        <Option value={'female'}>{t('user-management.filter.gender.female')}</Option>
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>{t('user-management.filter.staff-type.title')}</Typography>
                                    <Select value={searchData.type} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, type: value}
                                    })}>
                                        <Option value={''}>{t('user-management.filter.staff-type.default')}</Option>
                                        <Option value={'doctor'}>{t('staff-type.doctor', {ns: 'common'})}</Option>
                                        <Option value={'pharmacist'}>{t('staff-type.pharmacist', {ns: 'common'})}</Option>
                                        <Option value={'admin'}>{t('staff-type.admin', {ns: 'common'})}</Option>
                                        <Option value={'nurse'}>{t('staff-type.nurse', {ns: 'common'})}</Option>
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>{t('user-management.filter.status.title')}</Typography>
                                    <Select value={searchData.status} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, status: value}
                                    })}>
                                        <Option value={'default'}>{t('user-management.filter.status.default')}</Option>
                                        <Option value={'active'}>{t('user-management.filter.status.active')}</Option>
                                        <Option value={'inactive'}>{t('user-management.filter.status.inactive')}</Option>
                                    </Select>
                                </Stack>
                                <Stack columnGap={3} direction={'row'} sx={{borderLeft: '2px solid yellow', paddingLeft: '1.25rem'}}>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>{t('user-management.filter.order.title')}</Typography>
                                        <Select defaultValue={'id'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, orderBy: value}
                                        })}>
                                            <Option value={'id'}>{t('user-management.filter.order.id')}</Option>
                                            <Option value={'fname'}>{t('user-management.filter.order.fname')}</Option>
                                            <Option value={'lname'}>{t('user-management.filter.order.lname')}</Option>
                                        </Select>
                                    </Stack>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>{t('user-management.filter.order.title-2')}</Typography>
                                        <Select defaultValue={'asc'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, order: value}
                                        })}>
                                            <Option value={'asc'}>{t('order.asc', {ns: 'common'})}</Option>
                                            <Option value={'desc'}>{t('order.desc', {ns: 'common'})}</Option>
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                }
                <section className={'user-table-wrapper'}>
                    {loaderData &&
                        <TableTemplate data={sortedStaffData !== null ? sortedStaffData : staffData} header={tableHeader} isPagination={true}
                                       currentValues={searchData} setCurrentValues={setSearchData} allowCheckbox={true}
                                       handleDelete={deleteStaff} isMutable={true} allowDelete={true} allowModify={true}
                                       handleModify={handleModify} ModifyTemplate={StaffModifyTemplate} currentModifyData={currentModifyData}
                                       setCurrentModifyData={setCurrentModifyData} deleteReason={deleteReason} setDeleteReason={setDeleteReason}
                                       totalPage={totalPage}
                        />
                    }
                </section>
            </section>
        </div>
    )
}