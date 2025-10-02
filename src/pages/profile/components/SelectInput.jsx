import React from "react";
import { iconMap } from "./iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SelectInput({
    label,
    name,
    value,
    onChange,
    col = 12,
    readOnly = false,
    options = [],
    hideLabel = false,
    icon = null,
}) {
    return (
        <div className={`col-md-${col} mb-3`}>
            {/* Label only if not hidden */}
            {!hideLabel && <label className="form-label">{label}</label>}

            <div className="input-group">
                {/* ✅ Correct way to render FontAwesome icons */}
                {icon && iconMap[icon] && (
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={iconMap[icon]} style={{ color: '#33B1BF' }} />
                    </span>
                )}

                <select
                    className="form-select"
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={readOnly}
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SelectInput;
