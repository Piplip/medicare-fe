import {Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {Typography} from "@mui/material";
import Button from "@mui/joy/Button";
import '../styles/staff-modify-template-style.css'
import {useEffect, useState} from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../config/FirebaseConfig.jsx";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import DefaultImage from '../assets/default.jpg'
import {adminAxios} from "../config/axiosConfig.jsx";

export default function StaffModifyTemplate(props) {
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const {t} = useTranslation('common')
    const [isConfirm, setIsConfirm] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const specialties = [
        "Allergy and Immunology", "Anesthesiology", "Cardio thoracic Surgery", "Cardiology", "Cardiovascular Disease",
        "Colon and Rectal Surgery", "Dermatology", "Emergency Medicine", "Endocrinology", "ENT (Ear, Nose, and Throat)", "Gastroenterology", "Geriatrics",
        "Hematology/Oncology", "Infectious Diseases", "Internal Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynecology", "Oncology",
        "Orthopedic Surgery", "Orthopedics", "Pathology", "Pediatrics", "Physical Medicine and Rehabilitation",
        "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Sports Medicine", "Surgery", "Urology", "Vascular Surgery"
    ]
    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery"]
    const [currentStaffData, setCurrentStaffData] = useState({})
    useEffect(() => {
        setCurrentStaffData({
            firstName: props.data[13],
            lastName: props.data[14],
            idCardNumber: props.data[37],
            phoneNumber: props.data[16],
            secPhoneNumber: props.data[17],
            gender: props.data[18],
            birthday: dayjs(props.data[15]),
            address: `${props.data[22]}, ${props.data[23]}, ${props.data[24]}, ${props.data[25]}, ${props.data[26]}`,
            primaryLanguage: props.data[19],
            email: props.data[38],
            type: props.data[3],
            startContract: dayjs(props.data[8]),
            endContract: dayjs(props.data[7]),
            department: props.data[28],
            specialty: props.data[33],
            status: props.data[10],
            imageURL: loadImage(props.data[2])
        })
    }, [props.data]);

    async function loadImage(url){
        let storageRef = ref(storage, url)
        await getDownloadURL(storageRef)
            .then(url => setCurrentStaffData(prev => {
                return {...prev, imageURL: url}
            }))
            .catch(err => {
                setCurrentStaffData(prev => {
                    return {...prev, imageURL: DefaultImage}
                })
            })
    }

    function handleChange(e, key){
        setCurrentStaffData(prev => {
            return {...prev, [key]: e.target.value}
        })
    }

    function handleSelectChange(type, value){
        setCurrentStaffData(prev => {
            return {...prev, [type]: value}
        })
    }

    function saveChanges(){
        console.log("ID CARD NUMBER BEFORE SEND:", currentStaffData.idCardNumber)
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

    console.log(currentStaffData)

    return (
        <>
            {props.data.length > 0 &&
                <Modal open={props.showModifyPanel} onClose={() => {
                    setIsModify(false)
                    setIsConfirm(false)
                    props.setShowModify(false)
                }}>
                    <ModalDialog sx={{paddingBlock: 1}}>
                        <Stack borderBottom={'1px solid'}>
                            <Typography
                                variant={'h5'}>{props.data[13]} {props.data[14]} - {props.data[6]}</Typography>
                            <ModalClose/>
                        </Stack>
                        <Stack direction={'row'} columnGap={4}>
                            <Stack>
                                <p className={'staff-detail-section-title'}>PROFILE PICTURE</p>
                                <Stack sx={{marginBottom: 3}}>
                                    <img
                                        src={currentStaffData.imageURL}
                                        alt={'image'} width={'250px'}/>
                                    <p className={'change-profile-img-btn'}>Change profile picture</p>
                                </Stack>
                                <Stack rowGap={1}>
                                    <Button variant={'soft'} onClick={() => setIsModify(true)}>Update
                                        profile</Button>
                                    <Button variant={'soft'} color={"danger"}>Delete profile</Button>
                                    {isModify && (
                                        isConfirm ? (
                                            <Button variant="solid" onClick={saveChanges}>
                                                {isLoading ?
                                                    <div className={'loader2'}></div>
                                                    :
                                                    "Click to confirm changes"
                                                }
                                            </Button>
                                        ) : (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                columnGap: '0.5rem'
                                            }}>
                                                <Button variant="solid" onClick={() => setIsConfirm(true)}>
                                                    Save changes
                                                </Button>
                                                <Button variant="soft" onClick={() => setIsModify(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </Stack>
                            </Stack>
                            <Stack>
                                <p className={'staff-detail-section-title'}>PERSONAL DETAILS</p>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>First Name</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.firstName}
                                                   onChange={(e) => handleChange(e, 'firstName')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.firstName}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Last Name</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.lastName}
                                                   onChange={(e) => handleChange(e, 'lastName')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.lastName}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>ID Card Number</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.idCardNumber}
                                                   onChange={(e) => handleChange(e, 'idCardNumber')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.idCardNumber}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Phone Number</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.phoneNumber}
                                                   onChange={(e) => handleChange(e, 'phoneNumber')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.phoneNumber} | {currentStaffData.secPhoneNumber}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Gender</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.gender}
                                                    onChange={(e, val) => handleSelectChange('gender', val)}>
                                                <Option value={'Male'}>Male</Option>
                                                <Option value={'Female'}>Female</Option>
                                            </Select>
                                            :
                                            <p className={'personal-details-item-content'}>{currentStaffData.gender}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Date of Birth</p>
                                        {isModify ?
                                            <DatePicker value={currentStaffData.birthday.subtract(1, "D")}
                                                        format={"DD - MM - YYYY"}
                                                        onChange={(date) => handleSelectChange('birthday', date)}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.birthday.toString().slice(0, 16)}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Address</p>
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
                                        <p className={'personal-details-item-title'}>Primary Language</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.primaryLanguage}
                                                    onChange={(e, val) => handleSelectChange('primaryLanguage', val)}
                                            >
                                                <Option value={'English'}>English</Option>
                                                <Option value={'Vietnamese'}>Vietnamese</Option>
                                                <Option value={'French'}>French</Option>
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.primaryLanguage}</p>
                                        }
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack rowGap={2}>
                                <Stack>
                                    <p className={'staff-detail-section-title'}>STAFF INFORMATION</p>
                                    <Stack rowGap={1}>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>Email</p>
                                            {isModify ?
                                                <input className={'personal-details-item-inp'}
                                                       value={currentStaffData.email}
                                                       onChange={(e) => handleChange(e, 'email')}
                                                /> :
                                                <p className={'personal-details-item-content'}>{currentStaffData.email}</p>
                                            }
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>Certification</p>
                                            <p className={'personal-details-item-content'}>{props.data[5]} - {props.data[6]}</p>
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>Staff Type</p>
                                            {isModify ?
                                                <Select size={"sm"} value={currentStaffData.type}
                                                        onChange={(e, val) => handleSelectChange('type', val)}
                                                >
                                                    <Option value={'DOCTOR'}>Doctor</Option>
                                                    <Option value={'PHARMACIST'}>Pharmacist</Option>
                                                    <Option value={'NURSE'}>Nurse</Option>
                                                    <Option value={'ADMIN'}>Admin</Option>
                                                </Select>
                                                :
                                                <p className={'personal-details-item-content'}>{currentStaffData.type}</p>
                                            }
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>Start Contract</p>
                                            {isModify ?
                                                <DatePicker value={currentStaffData.startContract.subtract(1, "D")}
                                                            format={"DD - MM - YYYY"}
                                                            onChange={(date) => handleSelectChange('startContract', date)}
                                                />
                                                :
                                                <p className={'personal-details-item-content'}>{currentStaffData.startContract.toString().slice(0, 16)}</p>
                                            }
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>End Contract</p>
                                            {isModify ?
                                                <DatePicker value={currentStaffData.endContract.subtract(1, "D")}
                                                            format={"DD - MM - YYYY"}
                                                            onChange={(date) => handleSelectChange('endContract', date)}
                                                /> :
                                                <p className={'personal-details-item-content'}>{currentStaffData.endContract.toString().slice(0, 16) || "Unknown"}</p>
                                            }
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}>Department</p>
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
                                                <p className={'personal-details-item-content'}>{currentStaffData.department}</p>
                                            }
                                        </div>
                                        <div className={'personal-details-item'}>
                                            <p className={'personal-details-item-title'}> Specialty</p>
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
                                                <p className={'personal-details-item-content'}>{currentStaffData.specialty}</p>
                                            }
                                        </div>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            }
        </>
    )
}