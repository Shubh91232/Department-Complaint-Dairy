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
import ComplainHome from './project/complain_path/com_home';
import ComplainForm from './project/complain_path/com_form';
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
        <Route path="/complain" element={<ComplainHome />} />
        <Route path="/complain-form" element={<ComplainForm />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
