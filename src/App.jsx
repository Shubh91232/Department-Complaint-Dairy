import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './project/home';
import AboutAct from './project/navbar/AboutAct';
import FormatOfApplication from './project/navbar/FormatOfApplication';
import Faq from './project/navbar/Faq';
import Publications from './project/navbar/Publications';
import Feedback from './project/navbar/Feedback';
import PhotoGallery from './project/navbar/PhotoGallery';
import VideoGallery from './project/navbar/VideoGallery';
import ContactUs from './project/navbar/ContactUs';
import ComplainForm from './project/complain_path/com_form';
import Dashboard from './project/complain_path/dashboard';
import Register from './project/complain_path/register';
import Notification from './project/complain_path/notification';
import Drafts from './project/complain_path/drafts';
import WorkHistory from './project/complain_path/history';
import TrackGrievance from './project/complain_path/track';
import CauseList from './project/info/CauseList';
import Act from './project/info/Act';
import Manual from './project/info/Manual';
import Circular from './project/info/Circular';
import NewsClippings from './project/info/NewsClippings';
import ComplainSummary from './project/complain_path/com_summary';
import { LanguageProvider } from './project/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/act" element={<AboutAct />} />
        <Route path="/format" element={<FormatOfApplication />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/photo-gallery" element={<PhotoGallery />} />
        <Route path="/video-gallery" element={<VideoGallery />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/complain" element={<ComplainForm />} />
        <Route path="/complain-form" element={<ComplainForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/history" element={<WorkHistory />} />
        <Route path="/track" element={<TrackGrievance />} />
        <Route path="/info/cause-list" element={<CauseList />} />
        <Route path="/info/act" element={<Act />} />
        <Route path="/info/manual" element={<Manual />} />
        <Route path="/info/circular" element={<Circular />} />
        <Route path="/info/news-clippings" element={<NewsClippings />} />
        <Route path="/complain-summary" element={<ComplainSummary />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
