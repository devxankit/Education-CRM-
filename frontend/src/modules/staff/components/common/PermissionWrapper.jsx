
import React from 'react';
import usePermissions from '../../hooks/usePermissions';

const PermissionWrapper = ({ permission, children, fallback = null }) => {
    // const { hasPermission } = usePermissions();
    // if (!hasPermission(permission)) return fallback;
    // For now, return children directly until hooks are implemented
    return <>{children}</>;
};

export default PermissionWrapper;