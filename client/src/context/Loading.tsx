// ローディング中を管理するコンテキスト
import React, { createContext, useContext, useState } from 'react';

export const LoadingContext = createContext({
    loading: false,
    setLoading: (loading: boolean) => { },
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}