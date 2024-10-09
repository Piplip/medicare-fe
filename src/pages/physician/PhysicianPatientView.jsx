import '../../styles/patient-view-style.css'
import PatientSearch from "../../components/PatientSearch.jsx"
import PatientDetailView from "../../components/PatientDetailView.jsx";

export default function PhysicianPatientView(){
    return (
        <div className={'patient-view-container'}>
            <PatientSearch />
            <PatientDetailView />
        </div>
    )
}