import { LinearProgress } from "@mui/material";
import { useContext } from "react";
import { LoadingContext } from "../context/Loading";



export const CmnLoadingBar = () => {
    // ローディングバーの表示
    const loading = useContext(LoadingContext); // ローディング状態を管理
    return (
        loading.loading ? <LinearProgress></LinearProgress> : <></>
    );
}