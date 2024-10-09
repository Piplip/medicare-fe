import '../../styles/admin-report-style.css'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import GroupsIcon from '@mui/icons-material/Groups';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function AdminReport(){
    const data = [
        {
            name: 'System Report',
            color: '#0C9A00',
            background: '#BFFFB9',
            reports: [
                {name: 'Patient Report', icon: <MedicalInformationIcon fontSize={'inherit'}/>},
                {name: 'Financial Report', icon: <AttachMoneyIcon fontSize={'inherit'}/>},
                {name: 'Operational Report', icon: <ManageHistoryIcon fontSize={'inherit'}/>},
                {name: 'Staff Data Report', icon: <GroupsIcon fontSize={'inherit'}/>},
            ]
        },
        {
            name: 'User Activity Report',
            color: '#1137FF',
            background: '#89F1FF',
            reports: [
                {name: 'User Activity Report', icon: <NaturePeopleIcon fontSize={'inherit'}/>},
                {name: 'User Session Report', icon: <HistoryToggleOffIcon fontSize={'inherit'}/>},
            ]
        },
        {
            name: 'Custom Report',
            color: '#A44500',
            background: '#FFE299',
            reports: [
                {name: 'Add New Report', icon: <AddCircleOutlineOutlinedIcon fontSize={'inherit'}/>},
            ]
        }
    ]
    return (
        <div className={'admin-report-container'}>
            <h1 style={{fontSize: '2rem', textAlign: 'center'}}>Report & Analytics</h1>
            <div className={'admin-report-wrapper'}>
                {data.map((item, index) => {
                    return (
                        <div key={index} className={'admin-report-section-container'}>
                            <p style={{color: item.color, textDecoration: 'underline', fontWeight: 'bold', fontSize: '1.25rem'}}>{item.name}</p>
                            <div className={'admin-report-section-wrapper'}>
                                {item.reports.map((report, index) => {
                                    return (
                                        <div key={index} className={'admin-report-item'}>
                                            <div className={'report-icon'}>
                                                {report.icon}
                                            </div>
                                            <p style={{backgroundColor: item.background, paddingBlock: '0.5rem', border: '1px solid'}}>{report.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}