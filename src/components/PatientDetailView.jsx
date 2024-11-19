import {Stack} from "@mui/material";
import TableTemplate from "./root/TableTemplate.jsx";
import {useState} from "react";
import {useLocation} from "react-router";

export default function PatientDetailView(){
    const demoTitle = ['Full Name', 'Date of Birth', 'Gender', 'Phone Number', 'Email Address', `Emergency Contact's Name`, `Emergency Contact's Phone Number`,
        `Emergency Contact's Email`]
    const demoData1 = [
        "John Doe",
        "1990-01-01",
        "Male",
        "123-456-7890",
        "john.doe@example.com",
        "Jane Smith",
        "555-555-5555",
        "jane.smith@example.com"
    ];
    const demoTitle2 = ['House Number', 'Street', 'District', 'City', 'Province', 'Billing Account Number', `Insurance's Policy Number`, `Insurance's Expiration Date`]
    const demoData2 = [
        "123",
        "Main Street",
        "My District",
        "Can Tho",
        "Can Tho",
        "1234567890",
        "ABC123",
        "2025-12-31",
    ];

    const demoData3 = [
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},   {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
        {dosage: '500mg', frequency: 'Twice a day', route: 'Oral', name: 'Paracetamol', image: 'https://www.prescriptiondoctor.com/storage/product_images_th/Paracetamol_-_32_x_500mg_Caplets.png'},
    ]
    const header = ['Medication Name', 'Medication Type', 'Dosage', 'Dosage Form', 'Dosage Strength', 'Frequency', 'Route', 'Start Date', 'End Date']
    const medicationData = [
        {
            medicationName: "Aspirin",
            medicationType: "Pain Reliever",
            dosage: 325,
            dosageForm: "Tablet",
            dosageStrength: "mg",
            frequency: "Twice a Day",
            route: "Oral",
            startDate: "2024-06-20",
            endDate: null,
        },
        {
            medicationName: "Amoxicillin",
            medicationType: "Antibiotic",
            dosage: 500,
            dosageForm: "Capsule",
            dosageStrength: "mg",
            frequency: "Three times a day",
            route: "Oral",
            startDate: "2024-06-18",
            endDate: "2024-06-27",
        },
        {
            medicationName: "Salbutamol",
            medicationType: "Bronchodilator",
            dosage: 2,
            dosageForm: "Metered Dose Inhaler (MDI)",
            dosageStrength: "", // No specific strength for inhalers
            frequency: "As needed",
            route: "Inhalation",
            startDate: "2024-05-01",
            endDate: null,
        },
        {
            medicationName: "Daily Multivitamin",
            medicationType: "Vitamin Supplement",
            dosage: 1,
            dosageForm: "Tablet",
            dosageStrength: "", // Multivitamins often have combined strengths
            frequency: "Once a Day",
            route: "Oral",
            startDate: "2024-01-10",
            endDate: null,
        },
    ]

    const [isNurse, setIsNurse] = useState(useLocation().pathname.includes('/nurse'))

    return (
        <section className={'patient-view-panel'}>
            <p className={'physician-panel-title'}>Patient Health Record</p>
            <div className={'patient-demographics-container'}>
                <p className={'patient-info-title'}>Patient Demographics</p>
                <div className={'patient-demographics-wrapper'}>
                    <section className={'demographics-title'}>
                        {demoTitle.map((title, index) => <p key={index}
                                                            className={'demographics-item'}>{title}</p>)}
                    </section>
                    <section className={'demographics-detail'}>
                        {demoData1.map((data, index) => <p key={index} className={'demographics-item'}>{data}</p>)}
                    </section>
                    <section className={'demographics-title'}>
                        {demoTitle2.map((title, index) => {
                            if (isNurse && (title === 'Billing Account Number' || title === `Insurance's Policy Number`)) {
                                return null;
                            }
                            return <p key={index} className={'demographics-item'}>{title}</p>
                        })}
                    </section>
                    <section className={'demographics-detail'}>
                        {demoData2.map((data, index) => {
                            if (isNurse && (index === 5 || index === 6)) {
                                return null;
                            }
                            return <p key={index} className={'demographics-item'}>{data}</p>
                        })}
                    </section>
                </div>
            </div>
            <div className={'medical-history-container'}>
                <p className={'patient-info-title'}>Medical History</p>
                <Stack sx={{backgroundColor: '#84FFB5'}} direction={'row'} justifyContent={'space-between'}>
                    <p>Allergies</p>
                    <p>Beerus, Son Goku, Vegeta, Uchiha Sasuke</p>
                </Stack>
                <Stack>
                    <p>Current Medication. <span
                        style={{color: 'blue', textDecoration: 'underline'}}>Go to details</span></p>
                    <div className={'medication-container'}>
                        {demoData3.map((data, index) => {
                            return (
                                <div key={index} className={'medication-item'}>
                                    <div className={'medication-item-wrapper'}>
                                        <img className={'medication-item-img'} src={data.image} alt={'medication'}/>
                                        <div style={{display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', flexGrow: 1}}>
                                            <p className={'medication-item-detail'}>{data.dosage}</p>
                                            <p className={'medication-item-detail'}>{data.frequency}</p>
                                            <p className={'medication-item-detail'}>{data.route}</p>
                                        </div>
                                    </div>
                                    <p className={'medication-name'}>{data.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </Stack>
                <div style={{height: '300px', backgroundColor: '#B2FFD1', padding: 0}}>
                    <p style={{backgroundColor: '#84FFB5', paddingInline: '2rem'}}>Past Diagnoses & Surgeries</p>
                    <div>

                    </div>
                </div>
            </div>
            <div className={'radiology-container'}>
                <p className={'patient-info-title'}>Radiology</p>
                <div className={'radiology-wrapper'}>
                    <div className={'radiology-item'}>
                        <img
                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlbjGQEfWzC8mxKzO60fn373ucsVkei8EoPg&s'}
                            alt={'radiology'}/>
                        <p className={'radiology-item-detail'}>Radiologists are medical doctors that specialize in
                            diagnosing and treating injuries and
                            diseases using medical imaging (radiology) procedures (exams/tests) such as X-rays,
                            computed tomography (CT), magnetic resonance imaging (MRI), nuclear medicine, positron
                            emission tomography (PET) and ultrasound.</p>
                    </div>
                    <div className={'radiology-item'}>
                        <img
                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlbjGQEfWzC8mxKzO60fn373ucsVkei8EoPg&s'}
                            alt={'radiology'}/>
                        <p className={'radiology-item-detail'}>Radiologists are medical doctors that specialize in
                            diagnosing and treating injuries and
                            diseases using medical imaging (radiology) procedures (exams/tests) such as X-rays,
                            computed tomography (CT), magnetic resonance imaging (MRI), nuclear medicine, positron
                            emission tomography (PET) and ultrasound.</p>
                    </div>
                    <div className={'radiology-item'}>
                        <img
                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlbjGQEfWzC8mxKzO60fn373ucsVkei8EoPg&s'}
                            alt={'radiology'}/>
                        <p className={'radiology-item-detail'}>Radiologists are medical doctors that specialize in
                            diagnosing and treating injuries and
                            diseases using medical imaging (radiology) procedures (exams/tests) such as X-rays,
                            computed tomography (CT), magnetic resonance imaging (MRI), nuclear medicine, positron
                            emission tomography (PET) and ultrasound.</p>
                    </div>
                    <div className={'radiology-item'}>
                        <img
                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlbjGQEfWzC8mxKzO60fn373ucsVkei8EoPg&s'}
                            alt={'radiology'}/>
                        <p className={'radiology-item-detail'}>Radiologists are medical doctors that specialize in
                            diagnosing and treating injuries and
                            diseases using medical imaging (radiology) procedures (exams/tests) such as X-rays,
                            computed tomography (CT), magnetic resonance imaging (MRI), nuclear medicine, positron
                            emission tomography (PET) and ultrasound.</p>
                    </div>
                </div>
            </div>
            <div className={'progress-note-container'}>
                <p className={'patient-info-title'}>Progress Notes</p>
                <div className={'progress-note-wrapper'}>
                    <div className={'progress-note-item'}>
                        <p className={'progress-note-item-title'}>Subjective</p>
                    </div>
                    <div className={'progress-note-item'}>
                        <p className={'progress-note-item-title'}>Objective</p>
                    </div>
                    <div className={'progress-note-item'}>
                        <p className={'progress-note-item-title'}>Assessment</p>
                    </div>
                    <div className={'progress-note-item'}>
                        <p className={'progress-note-item-title'}>Plan</p>
                    </div>
                </div>
            </div>
            <div className={'detail-medication-container'}>
                <p className={'patient-info-title'}>Details Medication</p>
                <div style={{padding: '1rem'}}>
                    <TableTemplate header={header} data={medicationData} isPagination={false}/>
                </div>
            </div>
        </section>
    )
}