// CustomerFields.jsx

import React from 'react';
import TextInput from './TextInput';

function CustomerFields({ roleProfile, isEditing, handleChange }) {
    return (
        <div className="row">
            <TextInput
                label="Address"
                name="address"
                value={roleProfile.address || ''}
                onChange={handleChange}
                col={12}
                readOnly={!isEditing}
                icon="address"
            />
            <TextInput
                label="Blood Group"
                name="blood_group"
                value={roleProfile.blood_group || ''}
                onChange={handleChange}
                col={4}
                readOnly={!isEditing}
                icon="blood_group"
            />
            <TextInput
                label="Height(m)"
                name="height"
                value={roleProfile.height || ''}
                onChange={handleChange}
                col={4}
                readOnly={!isEditing}
                icon="height"
            />
            <TextInput
                label="Weight(kg)"
                name="weight"
                value={roleProfile.weight || ''}
                onChange={handleChange}
                col={4}
                readOnly={!isEditing}
                icon="weight"
            />
            <TextInput
                label="Medical History"
                name="medical_history"
                value={roleProfile.medical_history || ''}
                onChange={handleChange}
                col={12}
                multiline={true}
                rows={5}
                readOnly={!isEditing}
                icon="medical_history"
            />
        </div>
    );
}

export default CustomerFields;
