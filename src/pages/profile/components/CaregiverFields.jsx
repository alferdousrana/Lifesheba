// NurseFields.jsx

import React from 'react';
import TextInput from './TextInput';
import SelectInput from './SelectInput';

function CaregiverFields({ roleProfile, handleChange, isEditing }) {
    return (
        <div className="row">
            <TextInput
                label="Training Certificate"
                name="training"
                value={roleProfile.training || ''}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                icon="training"
            />
            <TextInput
                label="Education"
                name="education"
                value={roleProfile.education || ''}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                icon="degree"
            />
            <TextInput
                label="Training Result"
                name="training_result"
                value={roleProfile.training_result || ''}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                icon="bmdc_no"
            />
            <SelectInput
                label="Availability Status"
                name="availability_status"
                value={roleProfile.availability_status || ''}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                options={[
                    { value: 'AVAILABLE', label: 'Available' },
                    { value: 'BUSY', label: 'Busy' },
                ]}
            />
            <TextInput
                label="Experience"
                name="experience"
                value={roleProfile.experience || ''}
                onChange={handleChange}
                col={12}
                readOnly={!isEditing}
                icon="experience"
            />
        </div>
    );
}

export default CaregiverFields;
