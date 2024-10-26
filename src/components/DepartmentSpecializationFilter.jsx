import {Stack, Typography} from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useTranslation} from "react-i18next";

export default function DepartmentSpecializationFilter({isLoading, searchData, handleSelectChange}) {
    const {t} = useTranslation(['findDoctor', 'common'])
    const specialties = [
        "Allergy and Immunology", "Anesthesiology", "Cardio thoracic Surgery", "Cardiology", "Cardiovascular Disease",
        "Colon and Rectal Surgery", "Dermatology", "Emergency Medicine", "Endocrinology", "ENT (Ear, Nose, and Throat)", "Gastroenterology", "Geriatrics",
        "Hematology/Oncology", "Infectious Diseases", "Internal Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynecology", "Oncology",
        "Orthopedic Surgery", "Orthopedics", "Pathology", "Pediatrics", "Physical Medicine and Rehabilitation",
        "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Sports Medicine", "Surgery", "Urology", "Vascular Surgery"
    ]
    const department = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery"]

    return (
        <>
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
        </>
    )
}