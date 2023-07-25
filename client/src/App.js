import './App.css';
import {AuthLayout} from './compoments/layout/AuthLayout';
import {AppLayout} from './compoments/layout/AppLayout';
import {Login} from './pages/Login';
import {Home} from './pages/Home';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Register} from './pages/Register';
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {CssBaseline} from "@mui/material"
import {Memo} from "./pages/Memo";

export const App = () => {
    const theme = createTheme({
        palette: {
            main: '#0000ff'
        },
    })

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    {/* localhost:5000にアクセスしたときのページ */}
                    <Route path='/' element={<AuthLayout/>}>
                        {/* localhost:5000/loginにアクセスしたときのページ */}
                        <Route path='/login' element={<Login/>}/>

                        {/* localhost:5000/registerにアクセスしたときのページ */}
                        <Route path='/register' element={<Register/>}/>
                    </Route>
                    <Route path="/" element={<AppLayout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="memo" element={<Home/>}/>
                        {/* to="/memo/x" のxの部分が対応*/}
                        <Route path="memo/:memoId" element={<Memo />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
