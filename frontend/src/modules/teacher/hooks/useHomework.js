/**
 * useHomework Hook for Teacher Module
 * Provides homework data and operations with loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { useTeacherStore } from '../../../store/teacherStore';
import * as homeworkApi from '../services/homework.api';

export const useHomework = (homeworkId = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const homeworkList = useTeacherStore(state => state.homeworkList);
    const setHomeworkList = useTeacherStore(state => state.setHomeworkList);

    // Fetch all homework
    const fetchHomework = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await homeworkApi.getHomeworkList();
            if (response.success) {
                setHomeworkList(response.data);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch homework');
        } finally {
            setLoading(false);
        }
    }, [setHomeworkList]);

    // Fetch single homework by ID
    const fetchHomeworkById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await homeworkApi.getHomeworkById(id);
            if (response.success) {
                return response.data;
            } else {
                setError(response.error);
                return null;
            }
        } catch (err) {
            setError('Failed to fetch homework');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create homework
    const createHomework = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await homeworkApi.createHomework(data);
            if (response.success) {
                setHomeworkList([...homeworkList, response.data]);
                return response.data;
            } else {
                setError(response.error);
                return null;
            }
        } catch (err) {
            setError('Failed to create homework');
            return null;
        } finally {
            setLoading(false);
        }
    }, [homeworkList, setHomeworkList]);

    // Update homework
    const updateHomework = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await homeworkApi.updateHomework(id, data);
            if (response.success) {
                setHomeworkList(homeworkList.map(hw =>
                    hw.id === id ? response.data : hw
                ));
                return response.data;
            } else {
                setError(response.error);
                return null;
            }
        } catch (err) {
            setError('Failed to update homework');
            return null;
        } finally {
            setLoading(false);
        }
    }, [homeworkList, setHomeworkList]);

    // Delete homework
    const deleteHomework = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await homeworkApi.deleteHomework(id);
            if (response.success) {
                setHomeworkList(homeworkList.filter(hw => hw.id !== id));
                return true;
            } else {
                setError(response.error);
                return false;
            }
        } catch (err) {
            setError('Failed to delete homework');
            return false;
        } finally {
            setLoading(false);
        }
    }, [homeworkList, setHomeworkList]);

    // Get current homework if ID is provided
    const homework = homeworkId
        ? homeworkList.find(hw => hw.id === homeworkId)
        : null;

    return {
        homework,
        homeworkList,
        loading,
        error,
        fetchHomework,
        fetchHomeworkById,
        createHomework,
        updateHomework,
        deleteHomework
    };
};

export default useHomework;
