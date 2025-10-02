// ProfilePictureUpload.jsx

import React from 'react';

function ProfilePictureUpload({ previewImage, commonProfile, handleProfilePicChange }) {
    return (
        <div className="col-12 mb-3">
            <label className="form-label">Profile Picture</label>

            {previewImage ? (
                <div className="mb-2">
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '150px' }}
                    />
                    <p className="text-muted">Current profile picture. Upload a new one to replace.</p>
                </div>
            ) : commonProfile?.profile_picture && (
                <div className="mb-2">
                    <img
                        src={commonProfile.profile_picture}
                        alt="Profile"
                        className="img-thumbnail"
                        style={{ maxWidth: '150px' }}
                    />
                    <p className="text-muted">Current profile picture. Upload a new one to replace.</p>
                </div>
            )}

            <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleProfilePicChange}
            />
        </div>
    );
}

export default ProfilePictureUpload;
