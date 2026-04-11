// hooks/useUserRole.js
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/auth-service/auth/me/');
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}