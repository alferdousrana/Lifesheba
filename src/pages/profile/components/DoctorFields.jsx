// DoctorFields.jsx
import React from 'react';
import TextInput from './TextInput';
import SelectInput from './SelectInput';

function DoctorFields({
    roleProfile,
    isEditing,
    handleChange,
    schedules = [],  // Default value here
    handleScheduleChange = () => { },
    addSchedule = () => { },
    removeSchedule = () => { },
}) {
    // ADD DEBUGGING
    console.log('DoctorFields - schedules:', schedules);
    console.log('DoctorFields - isEditing:', isEditing);
    console.log('DoctorFields - schedules.length:', schedules.length);

    const days = [
        { value: 'MONDAY', label: 'Monday' },
        { value: 'TUESDAY', label: 'Tuesday' },
        { value: 'WEDNESDAY', label: 'Wednesday' },
        { value: 'THURSDAY', label: 'Thursday' },
        { value: 'FRIDAY', label: 'Friday' },
        { value: 'SATURDAY', label: 'Saturday' },
        { value: 'SUNDAY', label: 'Sunday' },
    ];

    return (
        <div className="row">
            {/* Your existing doctor fields */}
            <TextInput label="Specialization" name="specialization"
                value={roleProfile.specialization || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="specialization"
            />
            <TextInput label="Degree" name="degree"
                value={roleProfile.degree || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="degree"
            />
            <TextInput label="Designation" name="designation"
                value={roleProfile.designation || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="degree"
            />
            <TextInput label="Years of Experience" name="years_of_experience"
                value={roleProfile.years_of_experience || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="degree"
            />
            <TextInput label="Fees" name="fees"
                value={roleProfile.fees || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="degree"
            />
            <TextInput label="Follow Up Fees" name="followUp_fees"
                value={roleProfile.followUp_fees || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="degree"
            />
            <TextInput label="BMDC Registration No." name="bmdc_no"
                value={roleProfile.bmdc_no || ''} onChange={handleChange}
                col={6} readOnly={!isEditing} icon="bmdc_no"
            />
            <SelectInput label="Availability Status" name="availability_status"
                value={roleProfile.availability_status || ''} onChange={handleChange}
                col={6} readOnly={!isEditing}
                options={[
                    { value: 'AVAILABLE', label: 'Available' },
                    { value: 'BUSY', label: 'Busy' },
                ]}
            />
            <TextInput label="About Doctor" name="about_doctor"
                value={roleProfile.about_doctor || ''} onChange={handleChange}
                col={12} readOnly={!isEditing} icon="chamber_address"
            />
            <TextInput label="Chamber Address" name="chamber_address"
                value={roleProfile.chamber_address || ''} onChange={handleChange}
                col={12} readOnly={!isEditing} icon="chamber_address"
            />

            <div className="col-12 mt-4">
                <h5>Schedules</h5>

                {isEditing ? (
                    <>
                        {schedules.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Day</th>
                                            <th>Morning Start</th>
                                            <th>Morning End</th>
                                            <th>Evening Start</th>
                                            <th>Evening End</th>
                                            <th>Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((schedule, index) => (
                                            <tr key={schedule.id || index}>
                                                <td>
                                                    <SelectInput
                                                        label="Day"
                                                        name="day"
                                                        value={schedule.day || ''}
                                                        onChange={(e) => handleScheduleChange(index, e)}
                                                        options={days}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <TextInput
                                                        label="Morning Start"
                                                        name="m_start_time"
                                                        type="time"
                                                        value={schedule.m_start_time || ''}
                                                        onChange={(e) => handleScheduleChange(index, e)}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <TextInput
                                                        label="Morning End"
                                                        name="m_end_time"
                                                        type="time"
                                                        value={schedule.m_end_time || ''}
                                                        onChange={(e) => handleScheduleChange(index, e)}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <TextInput
                                                        label="Evening Start"
                                                        name="e_start_time"
                                                        type="time"
                                                        value={schedule.e_start_time || ''}
                                                        onChange={(e) => handleScheduleChange(index, e)}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <TextInput
                                                        label="Evening End"
                                                        name="e_end_time"
                                                        type="time"
                                                        value={schedule.e_end_time || ''}
                                                        onChange={(e) => handleScheduleChange(index, e)}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <SelectInput
                                                        label="Active"
                                                        name="is_active"
                                                        value={schedule.is_active ? 'true' : 'false'}
                                                        onChange={(e) =>
                                                            handleScheduleChange(index, {
                                                                target: { name: 'is_active', value: e.target.value === 'true' }
                                                            })
                                                        }
                                                        options={[
                                                            { value: 'true', label: 'Yes' },
                                                            { value: 'false', label: 'No' },
                                                        ]}
                                                        hideLabel={true}
                                                        col={12}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeSchedule(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No schedules yet. Add one below.</p>
                        )}
                        <button type="button" className="btn btn-primary my-2" onClick={addSchedule}>
                            Add Schedule
                        </button>
                    </>
                ) : (
                    <>
                        {schedules.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark" >
                                        <tr >
                                            <th style={{ color: 'black' }}>Day</th>
                                            <th style={{ color: 'black' }}>Morning Hours</th>
                                            <th style={{ color: 'black' }}>Evening Hours</th>
                                            <th style={{ color: 'black' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((schedule, index) => (
                                            <tr key={schedule.id || index}>
                                                <td><strong>{schedule.day}</strong></td>
                                                <td>
                                                    {formatTimeRange(schedule.m_start_time, schedule.m_end_time) || 'N/A'}
                                                </td>
                                                <td>
                                                    {formatTimeRange(schedule.e_start_time, schedule.e_end_time) || 'N/A'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${schedule.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                        {schedule.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No schedules available.</p>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

function formatTimeRange(start, end) {
    if (!start || !end) return null;

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
}


export default DoctorFields;
