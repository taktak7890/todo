import React from 'react';
import { LoadingContext } from '../context/Loading';

export type CmnFormProps = Omit<React.HTMLProps<HTMLFormElement>, 'onSubmit'> & {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
}
export const CmnForm: React.FC<CmnFormProps> = (props) => {
    const { onSubmit, ...rest } = props;
    const loading = React.useContext(LoadingContext); // ローディング状態を管理

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // デフォルトのフォーム送信を防ぐ
        loading.setLoading(true); // ローディング状態をtrueにする
        if (onSubmit) {
            await onSubmit(e); // onSubmitが指定されている場合はそれを呼び出す
        }
        loading.setLoading(false); // ローディング状態をfalseにする
    };

    return (
        <form
            onSubmit={handleSubmit}
            {...rest}
        >
            {props.children}
        </form>
    );
}