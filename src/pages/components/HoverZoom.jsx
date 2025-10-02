import React, { useState, useEffect, useRef } from "react";

function HoverZoom({
    children,
    scale = 1.1,
    transition = "0.3s ease",
    triggerParentHover = false,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const parentRef = useRef(null);

    useEffect(() => {
        if (!triggerParentHover || !parentRef.current) return;

        const parent = parentRef.current.closest(".hover-parent");
        if (!parent) return;

        const handleEnter = () => setIsHovered(true);
        const handleLeave = () => setIsHovered(false);

        parent.addEventListener("mouseenter", handleEnter);
        parent.addEventListener("mouseleave", handleLeave);

        return () => {
            parent.removeEventListener("mouseenter", handleEnter);
            parent.removeEventListener("mouseleave", handleLeave);
        };
    }, [triggerParentHover]);

    const style = {
        transform: isHovered ? `scale(${scale})` : "scale(1)",
        transition: `transform ${transition}`,
        width: "100%",
        height: "100%",
    };

    return (
        <div
            ref={parentRef}
            style={{
                display: "block",
                overflow: "hidden",
                width: "100%",
                height: "100%",
            }}
            onMouseEnter={!triggerParentHover ? () => setIsHovered(true) : undefined}
            onMouseLeave={!triggerParentHover ? () => setIsHovered(false) : undefined}
        >
            <div style={style}>{children}</div>
        </div>
    );
}

export default HoverZoom;
