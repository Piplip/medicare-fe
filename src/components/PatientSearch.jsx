import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import SelectBasic from "./CustomSelect.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

export default function PatientSearch(){
    const searchSampleData = [
        {
            name: 'John Doe',
            dob: '01/01/1990',
            mrn: '123456',
            department: 'Cardiology',
            physician: 'Dr. Jane Doe'
        },
        {
            name: 'Jane Doe',
            dob: '02/02/1990',
            mrn: '654321',
            department: 'Cardiology',
            physician: 'Dr. John Doe'
        },
        {
            name: 'John Smith',
            dob: '03/03/1990',
            mrn: '456789',
            department: 'Cardiology',
            physician: 'Dr. Jane Doe'
        },
        {
            name: 'Jane Smith',
            dob: '04/04/1990',
            mrn: '987654',
            department: 'Cardiology',
            physician: 'Dr. John Doe'
        }
    ]
    const inputStyle = {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '10px'
    }
    const patients = [
        {
            name: "John Doe",
            roomNumber: 101,
            primaryPhysician: "Dr. Smith",
            reasonForAdmission: "Broken Leg",
            medicalInfo: {
                allergies: ["Penicillin", "Peanuts"],
                fallRisk: true
            },
            vitals: {
                temperature: 98.6,
                pulse: 72,
                respirationRate: 16,
                bloodPressure: {
                    systolic: 120,
                    diastolic: 80
                },
                oxygenSaturation: 97
            }
        },
        {
            name: "Jane Smith",
            roomNumber: 202,
            primaryPhysician: "Dr. Johnson",
            reasonForAdmission: "Chest Pain",
            medicalInfo: {
                allergies: ["Latex", "Shellfish"],
                fallRisk: false
            },
            vitals: {
                temperature: 99.2,
                pulse: 92,
                respirationRate: 22,
                bloodPressure: {
                    systolic: 145,
                    diastolic: 90
                },
                oxygenSaturation: 94
            }
        },
        {
            name: "Michael Brown",
            roomNumber: 305,
            primaryPhysician: "Dr. Lee",
            reasonForAdmission: "Appendicitis",
            medicalInfo: {
                allergies: ["Ibuprofen"],
                fallRisk: false
            },
            vitals: {
                temperature: 100.1,
                pulse: 110,
                respirationRate: 24,
                bloodPressure: {
                    systolic: 130,
                    diastolic: 85
                },
                oxygenSaturation: 96
            }
        },
        {
            name: "Emily Davis",
            roomNumber: 410,
            primaryPhysician: "Dr. Chen",
            reasonForAdmission: "Pneumonia",
            medicalInfo: {
                allergies: ["Dust", "Mold"],
                fallRisk: true
            },
            vitals: {
                temperature: 101.5,
                pulse: 85,
                respirationRate: 28,
                bloodPressure: {
                    systolic: 110,
                    diastolic: 70
                },
                oxygenSaturation: 92
            }
        },
        {
            name: "David Wilson",
            roomNumber: 507,
            primaryPhysician: "Dr. Patel",
            reasonForAdmission: "Kidney Stones",
            medicalInfo: {
                allergies: ["Sulfa Drugs"],
                fallRisk: false
            },
            vitals: {
                temperature: 99.0,
                pulse: 78,
                respirationRate: 18,
                bloodPressure: {
                    systolic: 125,
                    diastolic: 80
                },
                oxygenSaturation: 98
            }
        },{
            name: "John Doe",
            roomNumber: 101,
            primaryPhysician: "Dr. Smith",
            reasonForAdmission: "Broken Leg",
            medicalInfo: {
                allergies: ["Penicillin", "Peanuts"],
                fallRisk: true
            },
            vitals: {
                temperature: 98.6,
                pulse: 72,
                respirationRate: 16,
                bloodPressure: {
                    systolic: 120,
                    diastolic: 80
                },
                oxygenSaturation: 97
            }
        },
        {
            name: "Jane Smith",
            roomNumber: 202,
            primaryPhysician: "Dr. Johnson",
            reasonForAdmission: "Chest Pain",
            medicalInfo: {
                allergies: ["Latex", "Shellfish"],
                fallRisk: false
            },
            vitals: {
                temperature: 99.2,
                pulse: 92,
                respirationRate: 22,
                bloodPressure: {
                    systolic: 145,
                    diastolic: 90
                },
                oxygenSaturation: 94
            }
        },
        {
            name: "Michael Brown",
            roomNumber: 305,
            primaryPhysician: "Dr. Lee",
            reasonForAdmission: "Appendicitis",
            medicalInfo: {
                allergies: ["Ibuprofen"],
                fallRisk: false
            },
            vitals: {
                temperature: 100.1,
                pulse: 110,
                respirationRate: 24,
                bloodPressure: {
                    systolic: 130,
                    diastolic: 85
                },
                oxygenSaturation: 96
            }
        },
        {
            name: "Emily Davis",
            roomNumber: 410,
            primaryPhysician: "Dr. Chen",
            reasonForAdmission: "Pneumonia",
            medicalInfo: {
                allergies: ["Dust", "Mold"],
                fallRisk: true
            },
            vitals: {
                temperature: 101.5,
                pulse: 85,
                respirationRate: 28,
                bloodPressure: {
                    systolic: 110,
                    diastolic: 70
                },
                oxygenSaturation: 92
            }
        },
        {
            name: "David Wilson",
            roomNumber: 507,
            primaryPhysician: "Dr. Patel",
            reasonForAdmission: "Kidney Stones",
            medicalInfo: {
                allergies: ["Sulfa Drugs"],
                fallRisk: false
            },
            vitals: {
                temperature: 99.0,
                pulse: 78,
                respirationRate: 18,
                bloodPressure: {
                    systolic: 125,
                    diastolic: 80
                },
                oxygenSaturation: 98
            }
        },
    ];
    return (
        <div className={'nurse-patient-search'}>
            <section className={'patient-search patient-view-panel'}>
                <p className={'physician-panel-title'}>Patient Search</p>
                <div className={'patient-search-wrapper'}>
                    <section>
                        <p>Patient Name</p>
                        <TextField placeholder={`Enter a patient's name`} size="small" sx={inputStyle}/>
                    </section>
                    <section>
                        <p>Date of Birth</p>
                        <DatePicker sx={inputStyle} slotProps={{field: {size: 'small'}}}/>
                    </section>
                    <section>
                        <p>Medical Record Number</p>
                        <TextField placeholder={`Enter patient's medical record number`} size="small" sx={inputStyle}/>
                    </section>
                    <section>
                        <p>Department</p>
                        <SelectBasic width={100}/>
                    </section>
                    <section>
                        <p>Admitting Physician</p>
                        <SelectBasic width={100}/>
                    </section>
                </div>
                <Button className={'patient-search-btn'} sx={{backgroundColor: '#286078'}}
                        variant={'contained'}>Search</Button>
                {!searchSampleData &&
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{}}>
                            <Typography variant={'body1'} style={{textAlign: 'center'}}>Search Result</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: '#B2FFD1'}}>
                            <div className={'search-result'}>
                                <div className={'search-result-table'}>
                                    <div className={'search-result-header'}>
                                        <p>Name</p>
                                        <p>Date of Birth</p>
                                        <p>MRN</p>
                                        <p>Department</p>
                                        <p>Physician</p>
                                    </div>
                                    {searchSampleData.map((data, index) => (
                                        <Tooltip key={index} title={'Click to see details'} placement={'bottom'}>
                                            <div className={'search-result-row'}>
                                                <p>{data.name}</p>
                                                <p>{data.dob}</p>
                                                <p>{data.mrn}</p>
                                                <p>{data.department}</p>
                                                <p>{data.physician}</p>
                                            </div>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                }
            </section>
            <section style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <p className={'physician-panel-title'}>Your Patients</p>
                <div className={'patient-list'}>
                    {patients.map((patient, index) => {
                        return (
                            <div key={index} className={'patient-list-item'}>
                                <p>{patient.name} - Room {patient.roomNumber}</p>
                                <IconButton aria-label="delete" size="large">
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}