// import "antd-mobile/es/global";
import "../globalVars";
import serviceConfig from "../data/service";
import { ServiceProvider } from "../HOC/withService";
// import Router from "../router";
import { HashRouter, Routes, Route } from "react-router-dom";

const Router = HashRouter;

const App = (props: any) => {
    return (<ServiceProvider data={serviceConfig} env="DEV">
        <Router>
            <Routes>
                <Route path="/" element={<></>}/>
            </Routes>
            {props.children}
        </Router>
    </ServiceProvider>);
};

export default App;
export { useService } from "../HOC/withService";