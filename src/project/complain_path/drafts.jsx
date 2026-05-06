import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { fetchDraftsAPI } from '../../apiHandler/apis';
import { FileText, ChevronRight, Home, Loader2, Calendar, MapPin, Edit3, Trash2 } from 'lucide-react';

const Drafts = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const res = await fetchDraftsAPI();
        if (res.success) {
          setDrafts(res.data);
        }
      } catch (err) {
        console.error('Failed to load drafts', err);
      } finally {
        setLoading(false);
      }
    };
    loadDrafts();
  }, []);

  const handleResume = (draft) => {
    navigate('/complain-form', { state: { draftData: draft } });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col relative">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] transition-colors flex items-center gap-1"><Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e] font-semibold">{lang === 'hi' ? 'मेरे ड्राफ्ट्स' : 'My Drafts'}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#002b5e] mb-2 flex items-center gap-3">
            <FileText size={28} className="text-[#e65100]" />
            {lang === 'hi' ? 'अधूरे प्रकरण (ड्राफ्ट्स)' : 'Saved Drafts'}
          </h1>
          <p className="text-gray-600 text-[14px]">
            {lang === 'hi' ? 'आपके द्वारा सहेजे गए अधूरे प्रकरण। आप इन्हें फिर से खोल कर पूरा कर सकते हैं।' : 'Incomplete master entries saved by you. You can resume and complete them here.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-[#1976d2]" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="bg-white p-10 rounded-md shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{lang === 'hi' ? 'कोई ड्राफ्ट नहीं मिला' : 'No Drafts Found'}</h3>
            <p className="text-gray-500 mb-6">{lang === 'hi' ? 'आपके पास कोई भी अधूरा प्रकरण सहेजा हुआ नहीं है।' : 'You do not have any incomplete master entries saved.'}</p>
            <button onClick={() => navigate('/complain-form')} className="bg-[#1976d2] text-white px-6 py-2 rounded-sm font-bold shadow-sm hover:bg-[#115293] transition-colors">
              {lang === 'hi' ? 'नया प्रकरण दर्ज करें' : 'Start New Master Entry'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div key={draft._id} className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {lang === 'hi' ? 'ड्राफ्ट' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-[#002b5e] text-[15px] mb-2 leading-tight">
                    {draft.complain_profile?.complainer?.name ? (
                      <>{lang === 'hi' ? 'परिवादी:' : 'Complainant:'} <span className="text-[#1976d2]">{draft.complain_profile.complainer.name}</span></>
                    ) : (
                      <span className="italic text-gray-400">{lang === 'hi' ? 'परिवादी विवरण उपलब्ध नहीं' : 'Complainant Name Pending...'}</span>
                    )}
                  </h3>
                  
                  <div className="space-y-2 mt-4 text-[12px] text-gray-600">
                    <div className="flex items-start gap-2">
                      <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span><strong>{lang === 'hi' ? 'प्राप्ति तिथि:' : 'Received:'}</strong> {draft.core_case_information?.date || '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span><strong>{lang === 'hi' ? 'स्थान:' : 'Location:'}</strong> {draft.geographic_information?.district || 'Pending...'} {draft.geographic_information?.block ? `, ${draft.geographic_information.block}` : ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 border-t border-gray-100 flex gap-2">
                  <button onClick={() => handleResume(draft)} className="flex-1 bg-white border border-[#1976d2] text-[#1976d2] hover:bg-blue-50 py-1.5 font-bold rounded-sm flex justify-center items-center gap-1 transition-colors">
                    <Edit3 size={14} /> {lang === 'hi' ? 'पुनः आरंभ करें' : 'Resume Entry'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Drafts;
