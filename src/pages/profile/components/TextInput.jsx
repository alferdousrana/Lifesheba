import React, { useRef } from "react";
import { iconMap } from "./iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TextInput({
    label,
    name,
    value,
    onChange,
    col = 12,
    multiline = false,
    rows = 1,
    readOnly = false,
    icon = null,
    type = "text",
    hideLabel = false,
    placeholder = "",
    ...rest   // ✅ extra props (min, max, required, etc.)
}) {
    const inputRef = useRef(null);

    // যদি icon এ click করে calendar খুলতে চাই
    const handleIconClick = () => {
        if (type === "date" && inputRef.current?.showPicker) {
            inputRef.current.showPicker();
        }
    };

    return (
        <div className={`col-md-${col} mb-3`}>
            {!hideLabel && <label className="form-label">{label}</label>}
            <div className="input-group">
                {icon && iconMap[icon] && (
                    <span
                        className="input-group-text"
                        style={{ cursor: type === "date" ? "pointer" : "default" }}
                        onClick={handleIconClick}
                    >
                        <FontAwesomeIcon icon={iconMap[icon]} style={{ color: "#33B1BF" }} />
                    </span>
                )}
                {multiline ? (
                    <textarea
                        className="form-control"
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        rows={rows}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        {...rest}   // ✅ apply extra props
                    />
                ) : (
                    <input
                        ref={inputRef}
                        type={type}
                        className="form-control"
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        {...rest}   // ✅ apply extra props
                    />
                )}
            </div>
        </div>
    );
}

export default TextInput;
