import '../../styles/admin-setting-style.css'
import {Button} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import FaxIcon from '@mui/icons-material/Fax';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Switch from '@mui/material/Switch';
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import {useOutletContext} from "react-router-dom";

export default function AdminSetting(){
    const contactInfo = [
        {name: 'Phone Number', value: import.meta.env.VITE_PHONE, icon: <PhoneIcon />},
        {name: 'Address', value: import.meta.env.VITE_ADDRESS, icon: <HomeIcon />},
        {name: 'Fax Number', value: import.meta.env.VITE_FAX, icon: <FaxIcon />},
        {name: 'Emergency Phone Number', value: import.meta.env.VITE_EMERGENCY_PHONE, icon: <LocalHospitalIcon />},
        {name: 'Email Address', value: import.meta.env.VITE_EMAIL, icon: <EmailIcon />},
        {name: 'Patient Portal URL', value: import.meta.env.VITE_PATIENT_PORTAL, icon: <LanguageIcon />},
    ]
    const [language, setLanguage] = useOutletContext()

    return (
        <div id={'setting-container'}>
            <p className={'page-title'}>Setting</p>
            <div>
                <div className={'setting-section-container'}>
                    <div className={'setting-section'}>
                        <div className={'setting-section-header'}>
                            <p>General</p>
                        </div>
                        <div className={'setting-section-body'} id={'general-setting-body'}>
                            <div className={'hospital-name-container'}>
                                <p>Patient Portal Website's Title</p>
                                <p style={{backgroundColor: '#D9D9D9', padding: '0.5rem', textAlign: 'center'}}>Medicare Plus</p>
                            </div>
                            <div>
                                <p>Contact Information</p>
                                <div className={'contact-info-wrapper'}>
                                    {contactInfo.map((contact, index) => {
                                        return (
                                            <div key={index} className={'contact-info'}>
                                                <div className={'contact-icon'}>
                                                    {contact.icon}
                                                    <p>{contact.name}</p>
                                                </div>
                                                <div className={'contact-detail'}>
                                                    <p className={'contact-info-value'}>{contact.value}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <Button variant="contained">CHANGE INFO</Button>
                        </div>
                    </div>
                    <div className={'setting-section'} id={'setting-security-section'}>
                        <div className={'setting-section-header'}>
                            <p>Security</p>
                        </div>
                        <div className={'setting-section-body'} id={'setting-security-body'}>
                            <section className={'setting-security-item'}><p>Apply Password Policy</p><Switch  /></section>
                            <section className={'setting-security-item'}><p>Two Factor Authentication</p><Switch  /></section>
                            <section className={'setting-security-item'}>
                                <p>Minimum Password Length</p>
                                <p style={{backgroundColor: 'black', color: 'white', padding: '0.25rem 2rem'}}>12</p>
                            </section>
                            <section className={'setting-security-item'}><p>Block APIs Access</p><Switch  /></section>
                            <section className={'setting-security-item'}><p>Enable Audit Logs</p><Switch  /></section>
                            <section className={'setting-security-item'}><p>Data Encryption</p><Switch  /></section>
                            <section className={'setting-security-item'}><p>Block Database Access</p><Switch  /></section>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className={'setting-section-container'}>
                    <div className={'setting-section'}>
                        <div className={'setting-section-header'}>
                            <p>Security</p>
                        </div>
                        <div className={'setting-section-body'}>
                            <div className={'setting-section-item_space-between'}>
                                <p>Backup Scheduling</p>
                                <div className={'back-up-scheduling-container'}>
                                    <p>Daily</p>
                                    <p>Weekly</p>
                                    <p>Custom</p>
                                </div>
                            </div>
                            <div className={'setting-section-item_space-between'}>
                                <p>Data Retention Policy</p>
                                <p>7 years</p>
                            </div>
                            <div className={'setting-section-item_space-between'}>
                                <p>Automatic Archive</p>
                                <Switch/>
                            </div>
                        </div>
                    </div>
                    <div className={'setting-section'}>
                        <div className={'setting-section-header'}>
                            <p>Display</p>
                        </div>
                        <div className={'setting-section-body'}>
                            <div className={'setting-section-item_space-between'}>
                                <p>Date Format</p>
                                <Select defaultValue={24}>
                                    <Option value={12} onClick={() => setLanguage('vi')}>12-Hour</Option>
                                    <Option value={24} onClick={() => setLanguage('en')}>24-Hour</Option>
                                </Select>
                            </div>
                            <div className={'setting-section-item_space-between'}>
                                <p>Time Format</p>
                                <Select defaultValue={"dd-mm-yyyy"}>
                                    <Option value={"dd-mm-yyyy"} onClick={() => setLanguage('vi')}>DD-MM-YYYY</Option>
                                    <Option value={"mm-dd-yyyy"} onClick={() => setLanguage('en')}>MM-DD-YYYY</Option>
                                </Select>
                            </div>
                            <div className={'setting-section-item_space-between'}>
                                <p>Default Language</p>
                                <Select value={language}>
                                    <Option value={"vi"} onClick={() => setLanguage('vi')}>Tiếng Việt</Option>
                                    <Option value={"en"} onClick={() => setLanguage('en')}>English</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}