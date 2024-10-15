import "../../styles/admin-user-management-style.css"
import AddIcon from '@mui/icons-material/Add';
import {Button, Stack, Tab, Typography,} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TableTemplate from "../../components/TableTemplate.jsx";
import {useLoaderData} from "react-router";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {adminAxios} from "../../config/axiosConfig.jsx";
import {Tabs} from "@mui/material";
import {Modal} from "@mui/joy";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import Input from '@mui/joy/Input';
import DepartmentSpecializationFilter from "../../components/DepartmentSpecializationFilter.jsx";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import StaffModifyTemplate from "../../components/StaffModifyTemplate.jsx";
import SimpleTableTemplate from "../../components/SimpleTableTemplate.jsx";

export default function AdminUserManagement(){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const loaderData = useLoaderData()
    const [staffData, setStaffData] = useState(loaderData.data.records)
    const [sortedStaffData, setSortedStaffData] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const tableHeader = ['ID', 'Last Name', 'First Name', 'Phone', 'Gender', 'Department', 'Specialization', 'Type', 'Email', 'Status']
    const [searchParams, setSearchParams] = useSearchParams()
    const [successCreatedStaffData, setSuccessCreatedStaffData] = useState([])
    const [failedCreatedStaffData, setFailedCreatedStaffData] = useState([])
    const [queryName, setQueryName] = useState(searchParams.get('name') || '')
    const [currentModifyData, setCurrentModifyData] = useState([])
    const [viewMode, setViewMode] = useState(0)
    const [searchData, setSearchData] = useState({
        department: searchParams.get('department') || 'default',
        language: searchParams.get('language') || 'default',
        specialization: searchParams.get('specialization') || 'default',
        gender: searchParams.get('gender') || '',
        pageSize: parseInt(searchParams.get('pageSize')) || 10,
        pageNumber: parseInt(searchParams.get('pageNumber')) || 1,
        type: searchParams.get('type') || '',
        status: searchParams.get('status') || 'default'
    })

    const [sortOption, setSortOption] = useState({
        orderBy: 'id',
        order: 'asc'
    })
    const [showFilters, setShowFilters] = useState(false)

    const handleChangeViewMode = (event, newValue) => {
        setViewMode(newValue)
    };

    const successStaffHeader = ['Account ID', 'Staff ID', 'First Name', 'Last Name', 'Date of Birth', 'ID Number', 'Phone Number', 'Email', 'Password', 'Role']
    const successDataKey = ['accountID', 'staffID', 'firstname', 'lastname', 'dateOfBirth', 'CCCD', 'phoneNumber', 'email', 'password', 'role']
    const failedStaffHeader = ['First Name', 'Last Name', 'Date of Birth', 'ID Number', 'Phone Number', 'Email', 'Password', 'Type']
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
                setStaffData(res.data.records)
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
                console.log("created staff data", r.data)
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
        adminAxios.delete('/staff?id=' + staffData[index][0])
            .then(res => {
                console.log(res)
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

    return (
        <div className={'user-management-container'}>
            <Modal aria-labelledby="modal-title" aria-describedby="modal-desc"
                   open={openModal}
                   onClose={() => setOpenModal(false)}
                   sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Stack sx={{ minWidth: 800, maxHeight: 600, backgroundColor: '#F0F4F8', padding: '1rem 1.25rem', overflowY: 'auto'
                    , boxShadow: '1rem 1rem green'}} rowGap={'1rem'}>
                    <Typography variant={'h4'} textAlign={'center'} borderBottom={'3px solid'}>ADDING STAFF</Typography>
                    {(successCreatedStaffData.length !== 0 || failedCreatedStaffData.length !== 0) ?
                        <Stack rowGap={2}>
                            <Typography variant={'h5'} color={"green"}>SUCCESSFULLY! VERIFIED CREATED DATA SHOWED BELOW</Typography>
                            <Tabs value={viewMode} onChange={handleChangeViewMode}>
                                <Tab label="Item One"/>
                                <Tab label="Item Two"/>
                            </Tabs>
                            {viewMode === 0 ?
                                <SimpleTableTemplate header={successStaffHeader} data={successCreatedStaffData} keys={successDataKey}/>
                                :
                                <SimpleTableTemplate header={failedStaffHeader} data={failedCreatedStaffData} keys={failedDataKey}/>
                            }
                            <Button variant={'contained'} onClick={() => setOpenModal(false)}>FINISHED REVIEW</Button>
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
                                {isLoading ? <div className={'loader'}></div> : 'UPLOAD AND GENERATE'}
                            </Button>
                        </>
                    }
                </Stack>
            </Modal>
            <Stack direction={'row'} alignItems={'center'} spacing={1} fontSize={'1.1rem'}>
                <h1>Employee (1829)</h1>
                <AddIcon style={{backgroundColor: '#00D1FF', borderRadius: '50%', color: 'white',}} onClick={() => setOpenModal(true)}/>
            </Stack>
            <section className={'user-table-container'}>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       className={'table-filters'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input autoFocus placeholder={'Search by name...'} sx={{minWidth: '25rem'}} value={queryName} onChange={handleQueryChange}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    fetchStaffData()
                                }
                            }}
                        />
                        <Button variant={'contained'} onClick={fetchStaffData}>FIND</Button>
                    </Stack>
                    <Button variant="contained" startIcon={<FilterAltIcon />} onClick={() => setShowFilters(prev => !prev)}>Sort & Filter</Button>
                </Stack>
                {showFilters &&
                    <Stack>
                        <Stack rowGap={2} className={'sort-filter-panel'}>
                            <p className={'clear-filter-btn'} onClick={clearFilters}>CLEAR ALL FILTERS</p>
                            <Stack direction={'row'} columnGap={3}>
                                <DepartmentSpecializationFilter isLoading={isLoading} searchData={searchData}
                                                                handleSelectChange={handleSelectChange}/>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>GENDER</Typography>
                                    <Select value={searchData.gender} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, gender: value}
                                    })}>
                                        <Option value={''}>Select a gender</Option>
                                        <Option value={'male'}>Male</Option>
                                        <Option value={'female'}>Female</Option>
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>STAFF TYPE</Typography>
                                    <Select value={searchData.type} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, type: value}
                                    })}>
                                        <Option value={''}>Select a type</Option>
                                        <Option value={'doctor'}>Doctor</Option>
                                        <Option value={'pharmacist'}>Pharmacist</Option>
                                        <Option value={'admin'}>Admin</Option>
                                        <Option value={'nurse'}>Nurse</Option>
                                    </Select>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Typography variant={'body2'}>STATUS</Typography>
                                    <Select value={searchData.status} onChange={(_, value) => setSearchData(prev => {
                                        return {...prev, status: value}
                                    })}>
                                        <Option value={'default'}>All</Option>
                                        <Option value={'active'}>Active</Option>
                                        <Option value={'inactive'}>Inactive</Option>
                                    </Select>
                                </Stack>
                                <Stack columnGap={3} direction={'row'} sx={{borderLeft: '2px solid yellow', paddingLeft: '1.25rem'}}>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>ORDER BY</Typography>
                                        <Select defaultValue={'id'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, orderBy: value}
                                        })}>
                                            <Option value={'id'}>ID</Option>
                                            <Option value={'fname'}>First Name</Option>
                                            <Option value={'lname'}>Last Name</Option>
                                        </Select>
                                    </Stack>
                                    <Stack rowGap={1}>
                                        <Typography variant={'body2'}>ORDER</Typography>
                                        <Select defaultValue={'asc'} onChange={(_, value) => setSortOption(prev => {
                                            return {...prev, order: value}
                                        })}>
                                            <Option value={'asc'}>Ascending</Option>
                                            <Option value={'desc'}>Descending</Option>
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                }
                <section className={'user-table-wrapper'}>
                    <TableTemplate data={sortedStaffData !== null ? sortedStaffData : staffData} header={tableHeader} isPagination={true}
                                   currentValues={searchData} setCurrentValues={setSearchData} allowCheckbox={true}
                                   handleDelete={deleteStaff} isMutable={true} allowDelete={true} allowModify={true}
                                   handleModify={handleModify} ModifyTemplate={StaffModifyTemplate} currentModifyData={currentModifyData}
                                   setCurrentModifyData={setCurrentModifyData}
                    />
                </section>
            </section>
        </div>
    )
}