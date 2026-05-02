import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Video, PlayCircle, X, Clock } from 'lucide-react';

const VideoGallery = () => {
  const { lang, t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: lang === 'hi' ? 'शिकायत कैसे दर्ज करें' : 'How to File a Complaint',
      duration: '5:24',
      thumbnail: '/assets/videos/thumb_grievance.png',
      desc: lang === 'hi' ? 'शिकायत दर्ज करने की चरण-दर-चरण प्रक्रिया।' : 'Step-by-step process for filing a grievance.'
    },
    {
      id: 2,
      title: lang === 'hi' ? 'आरटीआई गाइडलाइंस' : 'RTI Guidelines',
      duration: '8:15',
      thumbnail: '/assets/videos/thumb_rti.png',
      desc: lang === 'hi' ? 'सूचना के अधिकार का उपयोग कैसे करें।' : 'How to use the Right to Information Act.'
    },
    {
      id: 3,
      title: lang === 'hi' ? 'सिटीजन चार्टर' : 'Citizen Charter',
      duration: '4:45',
      thumbnail: '/assets/videos/thumb_citizen_charter.png',
      desc: lang === 'hi' ? 'नागरिकों के अधिकार और विभाग की प्रतिबद्धता।' : 'Rights of citizens and department commitments.'
    },
    {
      id: 4,
      title: lang === 'hi' ? 'डिजिटल इंडिया पहल' : 'Digital India Initiatives',
      duration: '6:30',
      thumbnail: '/assets/videos/thumb_digital_india.png',
      desc: lang === 'hi' ? 'सरकारी सेवाओं का डिजिटलीकरण।' : 'Digitization of government services.'
    },
    {
      id: 5,
      title: lang === 'hi' ? 'ग्राम विकास योजनाएं' : 'Village Development Schemes',
      duration: '10:20',
      thumbnail: '/assets/videos/thumb_village_dev.png',
      desc: lang === 'hi' ? 'ग्रामीण बुनियादी ढांचे के लिए नई योजनाएं।' : 'New schemes for rural infrastructure.'
    },
    {
      id: 6,
      title: lang === 'hi' ? 'महिला सशक्तिकरण कार्यक्रम' : 'Women Empowerment Programs',
      duration: '7:50',
      thumbnail: '/assets/videos/thumb_women_empowerment.png',
      desc: lang === 'hi' ? 'महिलाओं के लिए सरकारी सहायता योजनाएं।' : 'Government support schemes for women.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <Video className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'वीडियो गैलरी' : 'Video Gallery'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div 
                key={video.id} 
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 relative overflow-hidden bg-gray-900">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#e65100]/90 rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                      <PlayCircle size={40} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                    <Clock size={12} />
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-bold text-[#002b5e] text-[16px] mb-1 group-hover:text-[#e65100] transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-[12px] line-clamp-2 leading-relaxed">
                    {video.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black aspect-video rounded-sm shadow-2xl overflow-hidden">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-[#e65100] transition-colors rounded-full"
            >
              <X size={24} />
            </button>
            
            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900">
              <PlayCircle size={80} className="text-[#e65100] mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-400">{lang === 'hi' ? 'वीडियो स्ट्रीमिंग शुरू हो रही है...' : 'Starting video stream...'}</p>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e65100] w-1/3 animate-pulse" />
                </div>
                <div className="flex justify-between mt-2 text-[12px] font-mono text-gray-400">
                  <span>00:00</span>
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VideoGallery;
