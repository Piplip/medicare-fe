import {Modal, ModalClose, ModalDialog, Stack, Textarea} from "@mui/joy";
import PropTypes from 'prop-types';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Backdrop,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import Input from "@mui/joy/Input";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import Checkbox from "@mui/joy/Checkbox";
import {staffAxios, webSocketAxios} from "../config/axiosConfig.jsx";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

AddMedicineModal.propTypes = {
    open: PropTypes.bool,
    setMedicineModal: PropTypes.func,
    appointment: PropTypes.array,
    snackBar: PropTypes.object,
    setSnackBar: PropTypes.func,
}

function AddMedicineModal(props){
    const [loading, setLoading] = useState(false)
    const [medicine, setMedicine] = useState([])
    const [diagnosis, setDiagnosis] = useState({
        value: "",
        alert: false
    })
    const [isNull, setIsNull] = useState(false)
    const [select, setSelect] = useState([])
    const [query, setQuery] = useState("")
    const [subQuery, setSubQuery] = useState({
        pos: null, value: ""
    })
    const [suggestedList, setSuggestedList] = useState([])
    const [suggestPos, setSuggestedPos] = useState('main')
    const [noteModal, setNoteModal] = useState({
        pos: null, open: false
    })
    const [editable, setEditable] = useState(null)
    const {t} = useTranslation('common')

    useEffect(() => {
        if(props.appointment[14] === 'DONE')
            setEditable(true)
        else
            setEditable(false)
        if(props.open){
            staffAxios.get('/get/prescription?appointmentID=' + props.appointment[0])
                .then(async r => {
                    if(r.data !== ""){
                        const data = r.data.medicationList
                        for(let i= 0; i < data.length ; i++){
                            data[i].startDate = dayjs(data[i].startDate)
                            data[i].endDate = dayjs(data[i].endDate)
                        }
                        await setMedicine(data)
                        props.appointment[14] = 'DONE'
                        setDiagnosis(prev => ({...prev, value: r.data.diagnosis}))
                    }
                })
                .catch(err => console.log(err))
        }
    }, [props.open]);

    useEffect(() => {
        if(query === "" && subQuery.value === "") {
            setSuggestedList([])
            return
        }
        const _query = subQuery.value === "" ? query : subQuery.value
        staffAxios.get(`/medication/suggest?q=${_query}`)
           .then(r => {
               setSuggestedList(r.data)
           })
           .catch(err => console.log(err))
    }, [query, subQuery]);

    async function addMedicine(name){
        const medicine = {
            name: name,
            dosage: '',
            frequency: '',
            route: '',
            startDate: null,
            endDate: null,
            note: '',
        }
        await setMedicine(prev => [...prev, medicine])
        setSelect(prev => [...prev, false])
    }

    function resetState(){
        setEditable(false)
        setIsNull(false)
        setLoading(false)
        setMedicine([])
        setDiagnosis("")
        setSelect([])
        setQuery("")
        setSubQuery({
            pos: null, value: ""
        })
        setDiagnosis({
            value: "", alert: false
        })
        setSuggestedList([])
        setSuggestedPos('main')
        setNoteModal({
            pos: null, open: false
        })
        props.setMedicineModal({
            open: false, type: 'done'
        })
    }

    function submit(){
        if(diagnosis.value === ""){
            setDiagnosis({
                alert: true, value: ""
            })
            return
        }

        if(medicine.length === 0){
            alert(t('doctor.dashboard.medicine-modal.alert.no-medicine'))
            return
        }

        if(medicine.some(item => item.name === "" || item.dosage === "" || item.frequency === ""
            || item.route === "" || item.startDate === null || item.endDate === null)){
            setIsNull(true)
            return
        }

        setLoading(true)
        webSocketAxios.post('/create/prescription', {
            appointmentID: props.appointment[0],
            diagnosis: diagnosis.value,
            medicationList: medicine
        })
            .then(async r => {
                await resetState()
                props.appointment[14] = 'DONE'
                const content = r.data === "" ? t('doctor.dashboard.snackbar.success')
                    : t('doctor.dashboard.snackbar.failed')
                props.setSnackBar({
                    content: content, show: true
                })
            })
            .catch(err => console.log(err))
    }

    return (
        <Modal open={props.open} onClose={resetState}
            onKeyDown={(e) => {
                if(e.code === 'Delete') {
                    setSubQuery({
                        pos: null, value: ""
                    })
                    setMedicine(prev => prev.filter((_, index) => !select[index]))
                    setSelect(prev => prev.filter((item, _) => !item))
                }
            }}
        >
            <ModalDialog>
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Stack sx={{minWidth: '50rem', width: '100%', borderBottom: '1px solid'}}>
                    <ModalClose />
                    <Stack justifyContent={'space-between'} direction={'row'} paddingBottom={1}>
                        <Typography variant={'h5'}>{t('doctor.dashboard.medicine-modal.title')}</Typography>
                        <Stack sx={{position: 'relative'}}>
                            <Input autoFocus placeholder={t('doctor.dashboard.medicine-modal.placeholder.search')}
                                   sx={{minWidth: '25rem', transform: 'translateX(-1.25rem)'}} value={query}
                                   onChange={(e) => {
                                       setSubQuery({
                                             pos: null, value: ""
                                       })
                                       setSuggestedPos('main')
                                       setQuery(e.target.value)
                                   }}
                            />
                            <Stack className={'suggested-list'}>
                                {suggestedList && suggestPos === 'main' &&
                                    suggestedList.map((item, index) => {
                                        return (
                                            <Stack className={'suggested-item'} key={index} justifyContent={'space-between'} direction={'row'}>
                                                <div>{item}</div>
                                                <Button sx={{width: 'fit-content', fontSize: '0.6rem', padding: 0}} variant={'contained'}
                                                    color={'info'} onClick={() => {
                                                        setQuery("")
                                                        addMedicine(item)
                                                        setSuggestedList([])
                                                    }}
                                                >ADD</Button>
                                            </Stack>
                                        )
                                    })
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack>
                <Stack sx={{minHeight: '250px', borderBottom: '1px solid', maxHeight: '75dvh', overflowY: 'auto'}}>
                    <Stack rowGap={1}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                sx={{backgroundColor: 'black', padding: '0 1rem', margin: 0, color: 'white'}}
                            >{t('doctor.dashboard.medicine-modal.diagnosis').toUpperCase()}</AccordionSummary>
                            <AccordionDetails sx={{padding: 0}}>
                                 <textarea value={diagnosis.value} className={diagnosis.alert ? 'diagnosis-alert' : ''} name={'reason'} style={{
                                     padding: '0.25rem 0.5rem',
                                     fontSize: '1rem',
                                     backgroundColor: 'rgb(246,246,246)',
                                     fontFamily: 'cursive, sans-serif',
                                     minHeight: '5rem',
                                     maxHeight: '10rem',
                                     minWidth: '100%',
                                     maxWidth: '75rem'
                                 }} placeholder={diagnosis.alert ? t('doctor.dashboard.medicine-modal.alert.no-diagnosis')
                                     : t('doctor.dashboard.medicine-modal.placeholder.diagnosis')} onChange={(e) => {
                                     setDiagnosis({
                                         value: e.target.value, alert: false
                                     })
                                 }} disabled={editable}/>
                            </AccordionDetails>
                        </Accordion>
                        {medicine.map((item, index) => {
                            return (
                                <Stack className={'medicine-item'} key={index} direction={'row'} columnGap={1.25}
                                       alignItems={'center'}>
                                    <Checkbox checked={select[index] || false} onChange={() => {
                                        setSelect(prev => {
                                            const newSelect = [...prev]
                                            newSelect[index] = !newSelect[index]
                                            return newSelect
                                        })
                                    }}/>
                                    <p style={{width: '1rem'}}>{index + 1}.</p>
                                    <div>
                                        <Stack>
                                            <p className={'new-medicine-title'}>{t('table.m-name')}</p>
                                            <Stack sx={{position: 'relative'}}>
                                                <Input autoFocus value={item.name} disabled={editable}
                                                       placeholder={item.name === "" && isNull ? t('doctor.dashboard.medicine-modal.alert.no-field-data')
                                                           : t('doctor.dashboard.medicine-modal.placeholder.field', {field: t('table.m-name')})}
                                                       color={item.name === "" && isNull ? 'danger' : 'neutral'}
                                                       onChange={(e) => {
                                                           setIsNull(false)
                                                           setSuggestedPos('sub')
                                                           setSubQuery({pos: index, value: e.target.value})
                                                           setMedicine(prev => {
                                                               const newMedicine = [...prev]
                                                               newMedicine[index].name = e.target.value
                                                               return newMedicine
                                                           })
                                                       }}
                                                />
                                                <Stack className={'suggested-list'} sx={{
                                                    transform: 'translateY(100%)',
                                                    width: '125%',
                                                    maxHeight: '10rem'
                                                }}>
                                                    {suggestedList && suggestPos === 'sub' && subQuery.pos === index &&
                                                        suggestedList.map((_item, _index) => {
                                                            return (
                                                                <Stack
                                                                    className={'suggested-item'} key={_index}
                                                                    justifyContent={'space-between'} direction={'row'}>
                                                                    <div>{_item}</div>
                                                                    <Button sx={{
                                                                        width: 'fit-content',
                                                                        fontSize: '0.6rem',
                                                                        padding: 0
                                                                    }} variant={'contained'}
                                                                            color={'info'} onClick={() => {
                                                                        setSubQuery("")
                                                                        setMedicine(prev => {
                                                                            const newMedicine = [...prev]
                                                                            newMedicine[index].name = _item
                                                                            return newMedicine
                                                                        })
                                                                        setSuggestedList([])
                                                                    }}
                                                                    >{t('doctor.dashboard.medicine-modal.btn-change')}</Button>
                                                                </Stack>
                                                            )
                                                        })
                                                    }
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </div>
                                    <div>
                                        <Stack>
                                            <p className={'new-medicine-title'}>{t('table.dosage')}</p>
                                            <Input value={item.dosage} disabled={editable}
                                                   placeholder={item.dosage === "" && isNull ? t('doctor.dashboard.medicine-modal.alert.no-field-data')
                                                       : t('doctor.dashboard.medicine-modal.placeholder.field', {field: t('table.dosage')})}
                                                   color={item.dosage === "" && isNull ? 'danger' : 'neutral'}
                                                   onChange={(e) => {
                                                       setIsNull(false)
                                                       setMedicine(prev => {
                                                           const newMedicine = [...prev]
                                                           newMedicine[index].dosage = e.target.value
                                                           return newMedicine
                                                       })
                                                   }}
                                            />
                                        </Stack>
                                    </div>
                                    <div>
                                        <Stack>
                                            <p className={'new-medicine-title'}>{t('table.frequency')}</p>
                                            <Input value={item.frequency} disabled={editable}
                                                   placeholder={item.frequency == "" && isNull ? t('doctor.dashboard.medicine-modal.alert.no-field-data')
                                                       : t('doctor.dashboard.medicine-modal.placeholder.field', {field: t('table.frequency')})}
                                                   color={item.frequency == "" && isNull ? 'danger' : 'neutral'}
                                                   onChange={(e) => {
                                                       setIsNull(false)
                                                       setMedicine(prev => {
                                                           const newMedicine = [...prev]
                                                           newMedicine[index].frequency = e.target.value
                                                           return newMedicine
                                                       })
                                                   }}
                                            />
                                        </Stack>
                                    </div>
                                    <div>
                                        <Stack>
                                            <p className={'new-medicine-title'}>{t('table.route')}</p>
                                            <Select value={item.route} sx={{minWidth: '8rem'}} disabled={editable}
                                                    color={item.route === "" && isNull ? 'danger' : 'neutral'}
                                            onChange={(_, val) => {
                                                setMedicine(prev => {
                                                    const newMedicine = [...prev]
                                                    newMedicine[index].route = val
                                                    return newMedicine
                                                })
                                            }}>
                                                <Option value={''}>{t('doctor.dashboard.medicine-modal.route.default')}</Option>
                                                <Option value={'oral'}>{t('doctor.dashboard.medicine-modal.route.oral')}</Option>
                                                <Option value={'injection'}>{t('doctor.dashboard.medicine-modal.route.injection')}</Option>
                                                <Option value={'topical'}>{t('doctor.dashboard.medicine-modal.route.topical')}</Option>
                                                <Option value={'inhalation'}>{t('doctor.dashboard.medicine-modal.route.inhalation')}</Option>
                                            </Select>
                                        </Stack>
                                    </div>
                                    <div>
                                        <DatePicker format={"DD-MM-YYYY"} label={item.startDate === null && isNull ?
                                            t('doctor.dashboard.medicine-modal.alert.no-start-date')
                                            : t('doctor.dashboard.medicine-modal.placeholder.start-date')}
                                                    sx={{width: '200px'}} disabled={editable}
                                                    slotProps={{
                                                        textField: {
                                                            sx: {
                                                                width: '200px',
                                                                border: item.startDate === null && isNull ? '1px solid red' : ''
                                                            }
                                                        }
                                                    }}
                                                    value={item.startDate}
                                                    onChange={(val) => {
                                                        setIsNull(false)
                                                        setMedicine(prev => {
                                                            const newMedicine = [...prev]
                                                            newMedicine[index].startDate = val
                                                            return newMedicine
                                                        })
                                                    }}
                                        />
                                    </div>
                                    <div>
                                        <DatePicker format={"DD-MM-YYYY"} label={item.endDate === null && isNull ?
                                            t('doctor.dashboard.medicine-modal.alert.no-end-date')
                                            : t('doctor.dashboard.medicine-modal.placeholder.end-date')}
                                                    sx={{width: '200px'}} disabled={editable}
                                                    value={item.endDate}
                                                    slotProps={{
                                                        textField: {
                                                            sx: {
                                                                width: '200px',
                                                                color: '#f8bbd0',
                                                                border: item.endDate === null && isNull ? '1px solid red' : ''
                                                            }
                                                        }
                                                    }}
                                                    onChange={(val) => {
                                                        setMedicine(prev => {
                                                            const newMedicine = [...prev]
                                                            newMedicine[index].endDate = val
                                                            return newMedicine
                                                        })
                                                    }}
                                        />
                                    </div>
                                    <div style={{position: 'relative'}}>
                                        <SpeakerNotesIcon className={'note-btn'}
                                                          onClick={() => {
                                                              setNoteModal(prev => {
                                                                  return {
                                                                      pos: index,
                                                                      open: prev.pos === index ? !prev.open : true
                                                                  }
                                                              })
                                                          }}
                                        />
                                        {noteModal.pos === index && noteModal.open &&
                                            <Stack className={'note-panel'}>
                                                <Textarea autoFocus placeholder={t('doctor.dashboard.medicine-modal.placeholder.note')}
                                                          value={item.note} disabled={editable}
                                                          onBlur={() => {
                                                              setNoteModal({
                                                                  pos: null, open: false
                                                              })
                                                          }}
                                                          sx={{width: '20rem', minHeight: '5rem',
                                                              fontFamily: 'Courier', fontSize: '.95rem',
                                                              backgroundColor: '#143b3a', color: '#ffffff'
                                                          }}
                                                          onKeyDown={(e) => {
                                                              if (e.code === 'Enter') {
                                                                  setNoteModal({
                                                                      pos: null, open: false
                                                                  })
                                                              }
                                                          }}
                                                          onChange={(e) => {
                                                              setMedicine(prev => {
                                                                  const newMedicine = [...prev]
                                                                  newMedicine[index].note = e.target.value
                                                                  return newMedicine
                                                              })
                                                          }}
                                                />
                                            </Stack>
                                        }
                                    </div>
                                </Stack>
                            )
                        })}
                    </Stack>
                    <p className={'add-new-medicine-btn'}
                       onClick={() => {
                           if(editable) {
                               alert(t('doctor.dashboard.medicine-modal.alert.in-view-mode'))
                               return
                           }
                           addMedicine("")
                       }}
                    >{t('doctor.dashboard.medicine-modal.btn.add-new')}</p>
                </Stack>
                </Stack>
                <Stack direction={'row'} columnGap={'.5rem'} alignSelf={'end'}>
                    <Button variant={'contained'} color={'primary'}
                        onClick={() => {
                            if(editable) {
                                setEditable(false)
                            }
                            else submit()
                        }}
                    >{editable ? t('doctor.dashboard.medicine-modal.btn.edit') : t('doctor.dashboard.medicine-modal.btn.submit')}</Button>
                    <Button variant={'contained'} color={'error'}
                            onClick={resetState}
                    >{props.appointment[14] === 'DONE' ? t('doctor.dashboard.medicine-modal.btn.close')
                        : t('doctor.dashboard.medicine-modal.btn.cancel')}</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    )
}

export default AddMedicineModal