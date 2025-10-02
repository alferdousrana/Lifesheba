// RoleFieldsForm.jsx
import VendorFields from './VendorFields';
import CustomerFields from './CustomerFields';
import DoctorFields from './DoctorFields';
import NurseFields from './NurseFields';
import CaregiverFields from './CaregiverFields';
import TechnicianFields from './TechnicianFields';
import DeliveryManFields from './DeliveryManFields';

export default function RoleFieldsForm({ role, roleProfile, isEditing, handleChange, handleBankChange, showBankForm, setShowBankForm, schedules,
    handleScheduleChange,
    addSchedule,
    removeSchedule }) {
    switch (role) {
        case 'vendor':
            return <VendorFields {...{ roleProfile, isEditing, handleChange, handleBankChange, showBankForm, setShowBankForm }} />;
        case 'customer':
            return <CustomerFields {...{ roleProfile, isEditing, handleChange }} />;
        case 'doctor':
            // FIX: Pass all the schedule-related props to DoctorFields
            return <DoctorFields {...{
                roleProfile,
                isEditing,
                handleChange,
                schedules,
                handleScheduleChange,
                addSchedule,
                removeSchedule
            }} />;
        case 'nurse':
            return <NurseFields {...{ roleProfile, isEditing, handleChange }} />;
        case 'caregiver':
            return <CaregiverFields {...{ roleProfile, isEditing, handleChange }} />;
        case 'technician':
            return <TechnicianFields {...{ roleProfile, isEditing, handleChange }} />;
        case 'deliveryman':
            return <DeliveryManFields {...{ roleProfile, isEditing, handleChange }} />;
        default:
            return null;
    }
}
