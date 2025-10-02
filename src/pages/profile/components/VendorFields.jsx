import React from 'react';
import TextInput from './TextInput';

function VendorFields({
    roleProfile,
    isEditing,
    handleChange,
    handleBankChange,
    showBankForm,
    setShowBankForm,
}) {
    const toggleBankForm = () => setShowBankForm(prev => !prev);

    // ✅ Show if:
    // - Edit mode: showBankForm is true
    // - View mode: bank_info exists
    const shouldShowBankFields = isEditing ? showBankForm : !!roleProfile?.bank_info;

    return (
        <div className="row">
            <TextInput
                label="Company Name"
                name="company_name"
                value={roleProfile.company_name}
                onChange={handleChange}
                col={12}
                readOnly={!isEditing}
                icon="company_name"
            />
            <TextInput
                label="Business Type"
                name="business_type"
                value={roleProfile.business_type}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                icon="business_type"
            />
            <TextInput
                label="Tin Number"
                name="tin_number"
                value={roleProfile.tin_number}
                onChange={handleChange}
                col={6}
                readOnly={!isEditing}
                icon="tin_number"
            />
            <TextInput
                label="Address"
                name="address"
                value={roleProfile.address}
                onChange={handleChange}
                readOnly={!isEditing}
                icon="address"
            />

            {/* Toggle Button only for editing */}
            {isEditing && (
                <div className="col-12 my-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={toggleBankForm}>
                        {showBankForm ? 'Hide' : 'Add'} Bank Info
                    </button>
                </div>
            )}

            {shouldShowBankFields && (
                <>
                    <TextInput label="Bank Name" name="bank_name" value={roleProfile.bank_info?.bank_name || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="bank" />
                    <TextInput label="Account Name" name="account_name" value={roleProfile.bank_info?.account_name || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="account_name" />
                    <TextInput label="Account Number" name="account_number" value={roleProfile.bank_info?.account_number || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="account_number" />
                    <TextInput label="Branch Name" name="branch_name" value={roleProfile.bank_info?.branch_name || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="branch_name" />
                    <TextInput label="Routing Number" name="routing_number" value={roleProfile.bank_info?.routing_number || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="routing" />
                    <TextInput label="SWIFT Code" name="swift_code" value={roleProfile.bank_info?.swift_code || ''} onChange={handleBankChange} col={4} readOnly={!isEditing} icon="swift" />
                </>
            )}
        </div>
    );
}

export default VendorFields;
