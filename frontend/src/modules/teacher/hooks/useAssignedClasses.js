/**
 * useAssignedClasses Hook for Teacher Module
 */

import { useState, useEffect, useCallback } from 'react';
import * as classApi from '../services/class.api';

export const useAssignedClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        const response = await classApi.getAssignedClasses();
        if (response.success) {
            setClasses(response.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return { classes, loading, refetch: fetchClasses };
};

export default useAssignedClasses;
