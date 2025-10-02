// ProfileDetails.jsx (Optimized, Complete, and Readable)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';
import TextInput from './components/TextInput';
import RoleFieldsForm from './components/RoleFields';
import ProfilePictureUpload from './components/ProfilePictureUpload';

function formatFieldLabel(field) {
    if (!field) return '';
    return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export default function ProfileDetails() {
    const { baseUrl } = config;
    const [commonProfile, setCommonProfile] = useState(null);
    const [roleProfile, setRoleProfile] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showBankForm, setShowBankForm] = useState(false);

    // Fetch profile data
    // In ProfileDetails.jsx, update the fetchProfile function
    const fetchProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(`${baseUrl}/accounts/profile/me/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCommonProfile(res.data);
            // console.log('Common Profile:', res.data); // ADD THIS

            if (res.data.role) {
                const roleEndpoint = `${baseUrl}/${res.data.role.toLowerCase()}s/profile/`;
                const roleRes = await axios.get(roleEndpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoleProfile(roleRes.data);
                // console.log('Role Profile:', roleRes.data); // ADD THIS

                if (res.data.role.toLowerCase() === 'doctor') {
                    const schedulesRes = await axios.get(`${baseUrl}/doctors/schedules/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    // console.log('Schedules Response:', schedulesRes.data);

                    // Handle both paginated and non-paginated responses
                    let schedulesData;
                    if (schedulesRes.data.results) {
                        // Paginated response
                        schedulesData = schedulesRes.data.results;
                    } else if (Array.isArray(schedulesRes.data)) {
                        // Direct array response
                        schedulesData = schedulesRes.data;
                    } else {
                        // Fallback
                        schedulesData = [];
                    }

                    setSchedules(schedulesData);
                    console.log('Schedules State Set To:', schedulesData);
                } else {
                    setSchedules([]);
                }

                if (res.data.role.toLowerCase() === 'vendor' && roleRes.data.bank_info) {
                    setShowBankForm(true);
                }
            }
        } catch (err) {
            console.error('Fetch Profile Error:', err); // ADD THIS
            setError(err.response?.data?.detail || 'Failed to load profile');
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, [baseUrl,]); //eslint-disable-line

    useEffect(() => {
        if (isEditing && commonProfile?.profile_picture) {
            setPreviewImage(commonProfile.profile_picture);
        }
    }, [isEditing, commonProfile]);

    // Handlers
    const handleCommonChange = e => {
        const { name, value } = e.target;
        setCommonProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = e => {
        const { name, value } = e.target;
        setRoleProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleBankChange = e => {
        const { name, value } = e.target;
        setRoleProfile(prev => ({
            ...prev,
            bank_info: { ...(prev.bank_info || {}), [name]: value },
        }));
    };

    const handleScheduleChange = (index, e) => {
        const { name, value } = e.target;
        setSchedules(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [name]: value };
            return updated;
        });
    };

    const addSchedule = () => {
        setSchedules(prev => [...prev, { day: '', m_start_time: '', m_end_time: '', e_start_time: '', e_end_time: '', is_active: true }]);
    };

    const removeSchedule = index => {
        setSchedules(prev => prev.filter((_, i) => i !== index));
    };

    const handleProfilePicChange = e => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicFile(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setProfilePicFile(null);
            setPreviewImage(commonProfile?.profile_picture || null);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('You are not logged in.');
            return;
        }
        try {
            // Update common profile
            const formData = new FormData();
            Object.entries(commonProfile || {}).forEach(([key, value]) => {
                if (value && key !== 'profile_picture') {
                    formData.append(key, value);
                }
            });
            if (profilePicFile) {
                formData.append('profile_picture', profilePicFile);
            }

            await axios.put(`${baseUrl}/accounts/profile/me/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update role-specific profile
            if (commonProfile?.role) {
                const payload = { ...roleProfile };
                if (!showBankForm) delete payload.bank_info;

                await axios.put(`${baseUrl}/${commonProfile.role.toLowerCase()}s/profile/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Update schedules for doctors
                if (commonProfile.role.toLowerCase() === 'doctor') {
                    for (const schedule of schedules) {
                        if (schedule.id) {
                            await axios.put(`${baseUrl}/doctors/schedules/${schedule.id}/`, schedule, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                        } else {
                            await axios.post(`${baseUrl}/doctors/schedules/`, schedule, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                        }
                    }
                }
            }

            alert('Profile and schedules updated successfully!');
            setIsEditing(false);
            setProfilePicFile(null);
            setPreviewImage(null);
            fetchProfile();
        } catch (err) {
            alert('Failed to update profile: ' + (err.response?.data?.detail || err.message));
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className="alert alert-danger">No Profile Found</div>;

    const isDoctor = commonProfile?.role?.toLowerCase() === 'doctor';

    return (
        <div className="card shadow p-4">
            <h3 className="mb-3">{formatFieldLabel(commonProfile?.role)} Profile Details</h3>
            <p><strong>Email:</strong> {commonProfile?.email}</p>
            <p>Hello <strong>{commonProfile?.full_name}</strong>! Welcome to Life Sheba. Please update your profile for a better experience.</p>

            {commonProfile?.profile_picture && !isEditing && (
                <div className="mb-3">
                    <img
                        src={commonProfile.profile_picture}
                        alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            border: '3px solid #ccc'
                        }}
                    />
                </div>
            )}

            {isEditing ? (
                <div className="row">
                    <TextInput label="Full Name" name="full_name" value={commonProfile.full_name || ''} onChange={handleCommonChange} col={12} icon='user' />
                    <TextInput label="Gender" name="gender" value={commonProfile.gender || ''} onChange={handleCommonChange} col={4} icon="gender" />
                    <TextInput label="Date of Birth" name="date_of_birth" value={commonProfile.date_of_birth || ''} onChange={handleCommonChange} col={4} icon="birthdate" type="date" />
                    <TextInput label="Phone" name="phone" value={commonProfile.phone || ''} onChange={handleCommonChange} col={4} icon="phone" />
                    <TextInput label="City" name="city" value={commonProfile.city || ''} onChange={handleCommonChange} col={4} icon="city" />
                    <TextInput label="Zone" name="area" value={commonProfile.area || ''} onChange={handleCommonChange} col={4} icon="zone" />
                    <TextInput label="Zip Code" name="zip_code" value={commonProfile.zip_code || ''} onChange={handleCommonChange} col={4} icon="building" />
                    <TextInput label="Bio" name="bio" value={commonProfile.bio || ''} onChange={handleCommonChange} col={12} multiline rows={3} icon="bio" />

                    <ProfilePictureUpload
                        previewImage={previewImage}
                        commonProfile={commonProfile}
                        handleProfilePicChange={handleProfilePicChange}
                    />

                    <RoleFieldsForm
                        role={commonProfile.role}
                        roleProfile={roleProfile}
                        isEditing={isEditing}
                        handleChange={handleRoleChange}
                        handleBankChange={handleBankChange}
                        showBankForm={showBankForm}
                        setShowBankForm={setShowBankForm}
                        schedules={isDoctor ? schedules : []}
                        handleScheduleChange={isDoctor ? handleScheduleChange : () => { }}
                        addSchedule={isDoctor ? addSchedule : () => { }}
                        removeSchedule={isDoctor ? removeSchedule : () => { }}
                    />

                    <div className="row">
                        <div className="col-4 ">
                        <button className="btn btn-secondary" style={{width:"100%"}} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                        <div className="col-8">
                            <button className="btn btn-success me-2" style={{ width: "100%" }} onClick={handleUpdate}>Update</button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row">
                        <TextInput label="Full Name" value={commonProfile.full_name || ''} col={12} readOnly icon='user' />
                        <TextInput label="Gender" value={commonProfile.gender || ''} col={4} readOnly icon="gender" />
                        <TextInput label="Date of Birth" value={commonProfile.date_of_birth || ''} col={4} readOnly icon="birthdate" />
                        <TextInput label="Phone" value={commonProfile.phone || ''} col={4} readOnly icon="phone" />
                        <TextInput label="City" value={commonProfile.city || ''} col={4} readOnly icon="city" />
                        <TextInput label="Zone" value={commonProfile.area || ''} col={4} readOnly icon="zone" />
                        <TextInput label="Zip Code" value={commonProfile.zip_code || ''} col={4} readOnly icon="building" />
                        <TextInput label="Bio" value={commonProfile.bio || ''} col={12} multiline rows={1} readOnly icon="bio" />
                    </div>

                    <RoleFieldsForm
                        role={commonProfile.role}
                        roleProfile={roleProfile}
                        isEditing={false}
                        handleChange={handleRoleChange}
                        schedules={isDoctor ? schedules : []}
                        handleScheduleChange={isDoctor ? handleScheduleChange : () => { }}
                        addSchedule={isDoctor ? addSchedule : () => { }}
                        removeSchedule={isDoctor ? removeSchedule : () => { }}
                    />

                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </>
            )}
        </div>
    );
}
