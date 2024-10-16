import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from './components/App.jsx'
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import ScrollToTop from "./utils/ScrollToTop.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/freak'>
        <ScrollToTop />
        <App>
          <Routes>
            <Route index element={<PostListPage/>}/>
            <Route path="posts">
              <Route index element={<PostListPage/>}/>
              <Route path=":postTitle" element={<PostDetailPage/>}/>
            </Route>
            <Route path="about" element={<AboutPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </App>
    </BrowserRouter>
  </StrictMode>,
);
