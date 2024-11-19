import {Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {Typography} from "@mui/material";
import Button from "@mui/joy/Button";
import '../styles/staff-modify-template-style.css'
import {useCallback, useEffect, useState} from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../config/FirebaseConfig.jsx";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import DefaultImage from '../assets/default.jpg'
import {adminAxios} from "../config/axiosConfig.jsx";
import {useDropzone} from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

export default function StaffModifyTemplate(props) {
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const {t} = useTranslation(['common', 'admin'])
    const [isConfirm, setIsConfirm] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPPChange, setIsPPChange] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const specialties = [
        "Allergy and Immunology", "Anesthesiology", "Cardio thoracic Surgery", "Cardiology", "Cardiovascular Disease",
        "Colon and Rectal Surgery", "Dermatology", "Emergency Medicine", "Endocrinology", "ENT (Ear, Nose, and Throat)", "Gastroenterology", "Geriatrics",
        "Hematology/Oncology", "Infectious Diseases", "Internal Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynecology", "Oncology",
        "Orthopedic Surgery", "Orthopedics", "Pathology", "Pediatrics", "Physical Medicine and Rehabilitation",
        "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Sports Medicine", "Surgery", "Urology", "Vascular Surgery"
    ]
    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery", "Main Hospital Building"]
    const [currentStaffData, setCurrentStaffData] = useState({})
    useEffect(() => {
        setCurrentStaffData({
            firstName: props.data[14],
            lastName: props.data[15],
            idCardNumber: props.data[38],
            phoneNumber: props.data[17],
            secPhoneNumber: props.data[18],
            gender: props.data[19],
            birthday: dayjs(props.data[16]),
            address: `${props.data[23]}, ${props.data[24]}, ${props.data[25]}, ${props.data[26]}, ${props.data[27]}`,
            primaryLanguage: props.data[20],
            email: props.data[39],
            type: props.data[3],
            startContract: dayjs(props.data[8]),
            endContract: dayjs(props.data[7]),
            department: props.data[30],
            specialty: props.data[29],
            status: props.data[10],
            imageURL: loadImage(props?.data[2] ?? null)
        })
    }, [props.data]);

    const onDrop = useCallback(acceptedFiles => {
        setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
        setSelectedFile(acceptedFiles[0])
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    async function loadImage(url) {
        if(url === null) return
        let storageRef = ref(storage, url)
        await getDownloadURL(storageRef)
            .then(url => setCurrentStaffData(prev => {
                return {...prev, imageURL: url}
            }))
            .catch(() => {
                setCurrentStaffData(prev => {
                    return {...prev, imageURL: DefaultImage}
                })
            })
    }

    function handleChange(e, key) {
        setCurrentStaffData(prev => {
            return {...prev, [key]: e.target.value}
        })
    }

    function handleSelectChange(type, value) {
        setCurrentStaffData(prev => {
            return {...prev, [type]: value}
        })
    }

    function saveChanges() {
        adminAxios.patch('/staff/update', {
            staffID: props.data[0],
            staffType: currentStaffData.type,
            endDate: currentStaffData.endContract.format('YYYY-MM-DD'),
            accountID: props.data[35],
            idNumber: currentStaffData.idCardNumber,
            email: currentStaffData.email,
            personID: props.data[12],
            firstName: currentStaffData.firstName,
            lastName: currentStaffData.lastName,
            dateOfBirth: currentStaffData.birthday,
            phoneNumber: currentStaffData.phoneNumber,
            secPhoneNumber: currentStaffData.secPhoneNumber,
            primaryLanguage: currentStaffData.primaryLanguage,
            addressID: props.data[20],
            houseNumber: currentStaffData.address.split(',')[0],
            street: currentStaffData.address.split(',')[1],
            district: currentStaffData.address.split(',')[2],
            city: currentStaffData.address.split(',')[3],
            province: currentStaffData.address.split(',')[4],
        })
            .then(r => {
                setIsLoading(false)
                setIsModify(false)
                setIsConfirm(false)
                console.log(r)
            })
            .catch(err => console.log(err))
    }

    function generateFileName() {
        let seed = "abcdefghijklmnopqrstuvwxyz1234567890"
        let result = ''
        for (let i = 0; i < 20; i++) {
            result += seed[Math.floor(Math.random() * seed.length)]
        }
        return result
    }

    function handleUpdatePP() {
        if (!selectedFile) {
            alert('Please select an image file')
            return
        }
        const fileName = generateFileName()
        const storageRef = ref(storage, `/staff/${fileName}`)
        uploadBytes(storageRef, selectedFile)
            .then(res => {
                console.log(res)
                const imgURL = res.metadata.fullPath
                adminAxios.patch('/staff/update/profile-img?' + new URLSearchParams({
                    id: props.data[0],
                    imageURL: imgURL
                }))
                    .then(r => {
                        console.log(r)
                        setIsPPChange(false)
                        loadImage(`/staff/${fileName}`)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function resetStates(){
        setIsModify(false)
        setIsConfirm(false)
        setIsPPChange(false)
        setIsDeleted(false)
        setIsLoading(false)
        setPreviewImage(null)
        setSelectedFile(null)
    }

    return (
        <>
            {props.data.length > 0 &&
                <Modal open={props.showModifyPanel} onClose={() => {
                    resetStates()
                    props.setShowModify(false)
                }}>
                    <ModalDialog sx={{paddingBlock: 1}}>
                        <Stack borderBottom={'1px solid'}>
                            <Typography
                                variant={'h5'}>{props.data[13]} {props.data[14]} - {props.data[6]}</Typography>
                            <ModalClose/>
                        </Stack>
                        <Stack direction={'row'} columnGap={4} sx={{overflowY: 'auto'}}>
                            <Stack >
                                <div>
                                    <p className={'staff-detail-section-title'}>
                                        {t('user-management.modal.staff-detail.pp.title', {ns: 'admin'})}
                                    </p>
                                    <Stack sx={{marginBottom: 3}}>
                                        {isPPChange ?
                                            <Stack {...getRootProps()}
                                                   sx={{
                                                       width: '250px',
                                                       height: '350px',
                                                       border: '2px solid',
                                                       backgroundColor: '#7e7e7e',
                                                       color: 'white',
                                                       padding: '1rem',
                                                       textAlign: 'center'
                                                   }}
                                                   justifyContent={'center'}>
                                                <input {...getInputProps()} />
                                                {
                                                    previewImage ?
                                                        <div style={{position: 'relative'}}>
                                                            <ChangeCircleOutlinedIcon sx={{fontSize: 40}}
                                                                                      className={'user-pp-preview-change-btn'}
                                                                                      onClick={(e) => {
                                                                                          e.stopPropagation()
                                                                                          setPreviewImage(null)
                                                                                      }}
                                                            />
                                                            <img src={previewImage} style={{width: '100%'}}
                                                                 onLoad={() => URL.revokeObjectURL(previewImage)}
                                                                 alt={'image'}/>
                                                        </div>
                                                        :
                                                        isDragActive ?
                                                            <Stack justifyContent={'center'} alignItems={'center'}>
                                                                <CloudUploadIcon sx={{width: '5rem', height: '5rem'}}/>
                                                            </Stack>
                                                            :
                                                            <p style={{userSelect: 'none'}}>
                                                                {/*<Trans t={t} i18nKey={'admin.user-management.modal.staff-detail.pp.description'}/>*/}
                                                                Drag and drop image here<br/>or click to select image
                                                            </p>
                                                }
                                            </Stack>
                                            :
                                            <img
                                                src={currentStaffData.imageURL}
                                                alt={'image'} width={'250px'}/>
                                        }
                                        {isPPChange ?
                                            <Stack direction={'row'} justifyContent={'space-between'}
                                                   sx={{marginTop: '0.25rem'}}>
                                                <Button variant={'solid'} onClick={handleUpdatePP}>
                                                    {t('user-management.modal.staff-detail.button.accept', {ns: 'admin'})}
                                                </Button>
                                                <Button variant={'solid'} onClick={() => setIsPPChange(false)}>
                                                    {t('user-management.modal.staff-detail.button.cancel', {ns: 'admin'})}
                                                </Button>
                                            </Stack>
                                            :
                                            <p className={'change-profile-img-btn'} onClick={() => {
                                                setPreviewImage(null)
                                                setIsPPChange(prev => !prev)
                                            }}>
                                                {t('user-management.modal.staff-detail.button.change-pp', {ns: 'admin'})}
                                            </p>
                                        }
                                    </Stack>
                                </div>
                                <Stack rowGap={1}>
                                    <Button variant={'soft'} onClick={() => {
                                        setIsDeleted(false)
                                        setIsModify(true)
                                    }}>
                                        {t('user-management.modal.staff-detail.button.update-pp', {ns: 'admin'})}
                                    </Button>
                                    {/*<Button variant={'soft'} color={"danger"} onClick={() => {*/}
                                    {/*    setIsModify(false)*/}
                                    {/*    if (currentStaffData.status === 'Inactive') {*/}
                                    {/*        alert('This staff is already deleted')*/}
                                    {/*    } else {*/}
                                    {/*        setIsDeleted(prev => !prev)*/}
                                    {/*        if (isDeleted) {*/}
                                    {/*            props.handleDelete()*/}
                                    {/*        }*/}
                                    {/*    }*/}
                                    {/*}}>*/}
                                    {/*    {isDeleted ? 'Click to confirm changes' :*/}
                                    {/*        t('user-management.modal.staff-detail.button.delete-pp', {ns: 'admin'})*/}
                                    {/*    }*/}
                                    {/*</Button>*/}
                                    {isModify && (
                                        isConfirm ? (
                                            <Button variant="solid" onClick={saveChanges}>
                                                {isLoading ?
                                                    <div className={'loader2'}></div>
                                                    :
                                                    t('user-management.modal.staff-detail.button.confirm-changes', {ns: 'admin'})
                                                }
                                            </Button>
                                        ) : (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                columnGap: '0.5rem'
                                            }}>
                                                <Button variant="solid" onClick={() => setIsConfirm(true)}>
                                                    {t('user-management.modal.staff-detail.button.save-changes', {ns: 'admin'})}
                                                </Button>
                                                <Button variant="soft" onClick={() => setIsModify(false)}>
                                                    {t('user-management.modal.staff-detail.button.cancel', {ns: 'admin'})}
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </Stack>
                            </Stack>
                            <Stack sx={{overflowY: 'auto'}}>
                                <p className={'staff-detail-section-title'}>
                                    {t('user-management.modal.staff-detail.personal-info.title', {ns: 'admin'})}
                                </p>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.lname')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.firstName}
                                                   onChange={(e) => handleChange(e, 'firstName')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.firstName}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.fname')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.lastName}
                                                   onChange={(e) => handleChange(e, 'lastName')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.lastName}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.id-number')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.idCardNumber}
                                                   onChange={(e) => handleChange(e, 'idCardNumber')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.idCardNumber}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.phone')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.phoneNumber}
                                                   onChange={(e) => handleChange(e, 'phoneNumber')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.phoneNumber} | {currentStaffData.secPhoneNumber}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.gender')}</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.gender}
                                                    onChange={(e, val) => handleSelectChange('gender', val)}>
                                                <Option value={'Male'}>{t('gender.male')}</Option>
                                                <Option value={'Female'}>{t('gender.female')}</Option>
                                            </Select>
                                            :
                                            <p className={'personal-details-item-content'}>{t(`gender.${currentStaffData.gender}`)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.dob')}</p>
                                        {isModify ?
                                            <DatePicker value={currentStaffData.birthday.subtract(1, "D")}
                                                        format={"DD - MM - YYYY"}
                                                        onChange={(date) => handleSelectChange('birthday', date)}
                                                        sx={{backgroundColor: 'white'}}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.birthday.toString().slice(0, 16)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.address')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.address}
                                                   onChange={(e) => handleChange(e, 'address')}
                                            /> :
                                            <p className={'personal-details-item-content'}>
                                                {currentStaffData.address}
                                            </p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.primary-lang')}</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.primaryLanguage}
                                                    onChange={(e, val) => handleSelectChange('primaryLanguage', val)}
                                            >
                                                <Option value={'English'}>{t('lang.en')}</Option>
                                                <Option value={'Vietnamese'}>{t('lang.vi')}</Option>
                                                <Option value={'French'}>{t('lang.fr')}</Option>
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{t(`lang.${currentStaffData.primaryLanguage}`)}</p>
                                        }
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack>
                                <p className={'staff-detail-section-title'}>
                                    {t('user-management.modal.staff-detail.staff-info.title', {ns: 'admin'})}
                                </p>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.email')}</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.email}
                                                   onChange={(e) => handleChange(e, 'email')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.email}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.certification')}</p>
                                        <p className={'personal-details-item-content'}>{props.data[5]} - {props.data[6]}</p>
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.staff-type-2')}</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.type}
                                                    onChange={(e, val) => handleSelectChange('type', val)}
                                            >
                                                <Option value={'DOCTOR'}>{t('staff-type.doctor')}</Option>
                                                <Option value={'PHARMACIST'}>{t('staff-type.pharmacist')}</Option>
                                                <Option value={'NURSE'}>{t('staff-type.nurse')}</Option>
                                                <Option value={'ADMIN'}>{t('staff-type.admin')}</Option>
                                            </Select>
                                            :
                                            <p className={'personal-details-item-content'}>{t(`staff-type.${currentStaffData.type}`)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.start-contract')}</p>
                                        {isModify ?
                                            <DatePicker value={currentStaffData.startContract.subtract(1, "D")}
                                                        format={"DD - MM - YYYY"}
                                                        onChange={(date) => handleSelectChange('startContract', date)}
                                                        sx={{backgroundColor: 'white'}}
                                            />
                                            :
                                            <p className={'personal-details-item-content'}>{currentStaffData.startContract.toString().slice(0, 16)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.end-contract')}</p>
                                        {isModify ?
                                            <DatePicker value={currentStaffData.endContract.subtract(1, "D")}
                                                        format={"DD - MM - YYYY"}
                                                        onChange={(date) => handleSelectChange('endContract', date)}
                                                        sx={{backgroundColor: 'white'}}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.endContract.toString().slice(0, 16) || "Unknown"}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.department')}</p>
                                        {isModify ?
                                            <Select size={"sm"} onChange={handleSelectChange}
                                                    value={currentStaffData.department}>
                                                <Option select-type={'department'} value="default"
                                                        onClick={() => handleSelectChange('department', 'default')}
                                                >{t('department.default', {ns: 'common'})}</Option>
                                                {department.map((department, index) => (
                                                    <Option select-type={'department'} value={department}
                                                            key={index}
                                                            onClick={() => handleSelectChange('department', department)}
                                                    >
                                                        {t(`department.${department}`, {ns: 'common'})}</Option>
                                                ))}
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{t(`department.${currentStaffData.department}`)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}> {t('table.specialization')}</p>
                                        {isModify ?
                                            <Select size={"sm"} onChange={handleSelectChange}
                                                    value={currentStaffData.specialty}>
                                                <Option value="default"
                                                        onClick={() => handleSelectChange('specialty', 'default')}
                                                >{t(`speciality.default`, {ns: 'common'})}</Option>
                                                {specialties.map((speciality, index) => (
                                                    <Option value={speciality} key={index}
                                                            onClick={() => handleSelectChange('specialty', speciality)}
                                                    >
                                                        {t(`speciality.${speciality}`, {ns: 'common'})}</Option>
                                                ))}
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{t(`speciality.${currentStaffData.specialty}`)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>{t('table.status')}</p>
                                        <p className={'personal-details-item-content'}>{t(`status.${currentStaffData.status}`)}</p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            }
        </>
    )
}