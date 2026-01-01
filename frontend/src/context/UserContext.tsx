import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (data: Partial<User>) => Promise<void>;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token === 'mock-jwt-token-for-demo') {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const mockUser = { id: 1, email: 'abc@gmail.com', full_name: 'Admin User', role: 'admin' };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                }
            } else if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/users/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const updateUser = async (data: Partial<User>) => {
        const token = localStorage.getItem('token');
        if (token === 'mock-jwt-token-for-demo') {
            const updatedUser = { ...user, ...data } as User;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return;
        }

        if (token) {
            const response = await fetch('http://localhost:8000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to update profile');
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
