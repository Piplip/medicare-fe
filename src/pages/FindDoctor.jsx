import '../styles/find-a-doctor-style.css'
import {Button, FormControlLabel, Stack, Typography} from "@mui/material";
import Input from "@mui/material/Input";
import SearchIcon from '@mui/icons-material/Search';
import doc1 from '../assets/doctor img/doc1.png'
import doc2 from '../assets/doctor img/doc2.png'
import doc3 from '../assets/doctor img/doc3.png'
import doc4 from '../assets/doctor img/doc4.png'
import doc5 from '../assets/doctor img/doc5.png'
import doc6 from '../assets/doctor img/doc6.png'
import Checkbox from "@mui/material/Checkbox";
import StarIcon from '@mui/icons-material/Star';
import SelectBasic from "../components/CustomSelect.jsx";
import {useState} from "react";

export default function FindProvider(){
    const sampleData = [
        {name: 'Dr. Jane Smith', specialty: 'Cardiologist', language: 'English, Spanish', accept: true, img: doc1},
        {name: 'Dr. John Doe', specialty: 'Dermatologist', language: 'English, French', accept: false , img: doc2},
        {name: 'Dr. Emily Clark', specialty: 'Pediatrician', language: 'English, Mandarin, Korean', accept: true, img: doc3},
        {name: 'Dr. Michael Brown', specialty: 'Orthopedic Surgeon', language: 'English, German', accept: false, img: doc4},
        {name: 'Dr. Sarah Johnson', specialty: 'Neurologist', language: 'English, Italian', accept: true, img: doc5},
        {name: 'Dr. William David', specialty: 'Dentist', language: 'English, Japanese', accept: true, img: doc6},
    ]
    const [showMain, setShowMain] = useState(false)
    const [enableMoreFilters, setEnableMoreFilters] = useState(false)

    return (
        <div className={'find-provider-container'}>
            <Stack direction={'row'} columnGap={2}>
                <Input
                    onChange={() => setShowMain(true)}
                    sx={{
                        backgroundColor: 'white',
                        padding: '0.25rem 1rem',
                        fontSize: '1.25rem'
                    }}
                    placeholder={'Search by name, specialty, condition treated or language spoken...'} fullWidth/>
                <Button sx={{paddingInline: 2, borderRadius: 1}} size={'small'} variant="contained" startIcon={<SearchIcon />}>Find</Button>
            </Stack>
            {showMain ?
                <div className={'find-provider-main'}>
                    <Stack rowGap={4} color={'white'}>
                        <p style={{color: 'orange', fontSize: '0.75rem'}}>CLEAR ALL FILTERS</p>
                        <Stack rowGap={1}>
                            <Typography variant={'body2'}>INSTITUTES & DEPARTMENTS</Typography>
                            <input type={'text'} placeholder={'Find by institutes or departments'}
                                   className={'filter-inp'}/>
                        </Stack>
                        <Stack>
                            <Typography variant={'body2'}>TYPE OF DOCTOR</Typography>
                            <FormControlLabel control={<Checkbox/>} label="Adults only"/>
                            <FormControlLabel control={<Checkbox/>} label="Both Adults and Children & Adolescents"/>
                            <FormControlLabel control={<Checkbox/>} label="Children & Adolescents Only"/>
                        </Stack>
                        <Stack>
                            <Typography variant={'body2'}>GENDER OF DOCTOR</Typography>
                            <FormControlLabel control={<Checkbox/>} label="Male"/>
                            <FormControlLabel control={<Checkbox/>} label="Female"/>
                        </Stack>
                    </Stack>
                    <Stack rowGap={'1rem'} style={{backgroundColor: '#1a3536'}} padding={2}>
                        <Stack direction={'row'} paddingBlock={1}>
                            <Typography sx={{flexGrow: 1}} variant={'h4'} color={'yellow'} textAlign={'center'}>77777
                                Physicians</Typography>
                            <SelectBasic/>
                        </Stack>
                        <div className={'provider-search-result-container'}>
                            {sampleData.map((data, index) => (
                                <div key={index} className={'provider-card'}>
                                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                                           sx={{fontSize: '1.25rem', color: 'cyan'}}>
                                        <p>{data.name}</p>
                                        <h4>095 172 9129</h4>
                                    </Stack>
                                    <Stack direction={'row'} columnGap={3}>
                                        <img src={data.img} alt={data.name} className={'provider-image'}/>
                                        <div className={'provider-info'}>
                                            <div>
                                                <Stack direction={'row'}>
                                                    <StarIcon/>
                                                    <StarIcon/>
                                                    <StarIcon/>
                                                    <StarIcon/>
                                                    <StarIcon/>
                                                    <p style={{marginLeft: '0.5rem'}}>4.8 out of 5</p>
                                                </Stack>
                                                <p>293 Patient Satisfaction Ratings</p>
                                                <p>45 Patients give comments</p>
                                            </div>
                                            <div>
                                                <Stack>
                                                    <Typography variant={'body1'}>SPECIALTY</Typography>
                                                    <p>{data.specialty}</p>
                                                </Stack>
                                                <Stack>
                                                    <Typography variant={'body1'}>LANGUAGE SPOKEN</Typography>
                                                    <p>{data.language}</p>
                                                </Stack>
                                            </div>
                                        </div>
                                    </Stack>
                                    <Button variant={'contained'} sx={{width: 'fit-content'}}>Schedule
                                        Appointment</Button>
                                </div>
                            ))}
                        </div>
                    </Stack>
                </div> :
                <div style={{display: 'flex', flexDirection: 'column', rowGap: '1rem'}}>
                    <p className={'more-filter-btn'} onClick={() => setEnableMoreFilters(prev => !prev)}>
                        {enableMoreFilters ? 'LESS FILTERS-' : 'MORE FILTERS +'}
                    </p>
                    {enableMoreFilters &&
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem'}}>
                            <Stack rowGap={0.5}>
                                <p>LOCATIONS BY CITY</p>
                                <input type={'text'} placeholder={'Find by locations by city...'}
                                       className={'filter-inp'}/>
                            </Stack>
                            <Stack rowGap={0.5}>
                                <p>INSTITUTES & DEPARTMENTS</p>
                                <input type={'text'} placeholder={'Find by institutes or departments...'}
                                       className={'filter-inp'}/>
                            </Stack>
                        </div>
                    }
                </div>
            }
            <Typography variant={'body2'}>
                (*) The information provided in this search result is for general informational purposes only. While we
                strive to keep the information up to date and correct, we make no representations or warranties of any
                kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability
                with respect to the information, products, services, or related graphics contained on the website for
                any purpose. Any reliance you place on such information is therefore strictly at your own risk.
            </Typography>
        </div>
    )
}