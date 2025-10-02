

import React from 'react';
import TextInput from './TextInput';
import SelectInput from './SelectInput';

function DeliveryManFields({ roleProfile, handleChange, isEditing }) {
    return (
        <div className="row">
           
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
                label="Work Place"
                name="work_place"
                value={roleProfile.work_place || ''}
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
                col={6}
                multiline = {true}
                rows = {3}
                readOnly={!isEditing}
                icon="experience"
            />
        </div>
    );
}

export default DeliveryManFields;
