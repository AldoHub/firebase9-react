import * as React from "react";
import { Routes, Route} from "react-router-dom";

const Main = React.lazy(() => import("../components/Main"));
const Single = React.lazy(() => import("../components/Single"));
const New = React.lazy(() => import("../components/New"));

const AppRoutes = () => (

    <React.Suspense fallback={<span>Loading, please wait...</span>}>

        <Routes>
            <Route exact path="/" element= {<Main/>} />
            <Route exact path="/post/:id" element= {<Single/>} />
            <Route exact path="/new" element= {<New/>} />
        </Routes>


    </React.Suspense>

)

export default AppRoutes;