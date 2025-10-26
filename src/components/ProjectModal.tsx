import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { X, Github, ExternalLink, HelpCircle, Send } from 'lucide-react';

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    youtubeId: string;
    githubLink: string;
    kaggleLink: string;
  };
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({ name: '', email: '', query: '' });
  const [questionFormStatus, setQuestionFormStatus] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Question submitted:', questionFormData);
    setQuestionFormStatus('Your question has been submitted. Thank you!');
    
    // Clear form data after submission
    setTimeout(() => {
      setQuestionFormData({ name: '', email: '', query: '' });
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`bg-white rounded-xl max-w-3xl w-full relative overflow-hidden my-8 shadow-xl transform transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#563D7C] to-[#44B78B]"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-[#563D7C] z-10 bg-white/80 rounded-full p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-[#563D7C] mb-4">{project.title}</h2>

          {!showQuestionForm && project.youtubeId && (
            <div className="aspect-video mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
              <YouTube
                videoId={project.youtubeId}
                className="w-full h-full"
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    rel: 0,
                    modestbranding: 1,
                  },
                }}
              />
            </div>
          )}

          {!showQuestionForm && !project.youtubeId && (
            <div className="aspect-video mb-6 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-[#F5F0FF] to-[#E8F5F1] flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/80 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#563D7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[#563D7C] font-semibold">Demo Video Coming Soon</p>
                <p className="text-sm text-gray-500 mt-1">Stay tuned for a detailed walkthrough</p>
              </div>
            </div>
          )}

          {!showQuestionForm && (
            <p className="text-[#2D2D2D] mb-6 text-lg leading-relaxed">{project.description}</p>
          )}

          {!showQuestionForm && (
            <div className="flex flex-wrap gap-4">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#563D7C] rounded-lg hover:bg-[#8C6BC8] transition-all duration-200 text-white hover:shadow-lg hover:-translate-y-0.5"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>
              {project.kaggleLink && (
                <a
                  href={project.kaggleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#44B78B] rounded-lg hover:bg-[#44B78B]/90 transition-all duration-200 text-white hover:shadow-lg hover:-translate-y-0.5"
                >
                  <img src="/kaggle.svg" alt="Kaggle" className="w-5 h-5" />
                  <span>Kaggle</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>
              )}
              <button
                onClick={() => setShowQuestionForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F5F0FF] border border-[#563D7C]/20 rounded-lg hover:bg-[#563D7C]/10 transition-all duration-200 text-[#563D7C]"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Ask a Question</span>
              </button>
            </div>
          )}

          {showQuestionForm && (
            <div className="mt-2 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-[#563D7C]">Ask About {project.title}</h3>
                <button 
                  onClick={() => setShowQuestionForm(false)} 
                  className="text-gray-500 hover:text-[#563D7C] bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                  aria-label="Return to project details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleQuestionSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      className="contact-input"
                      value={questionFormData.name}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="contact-input"
                      value={questionFormData.email}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Question</label>
                  <textarea
                    id="query"
                    placeholder="I'd like to know more about the technologies you used..."
                    rows={5}
                    className="contact-input"
                    value={questionFormData.query}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, query: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="submit-button">
                    Submit Question
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </div>
                {questionFormStatus && (
                  <div className="mt-4 py-2 px-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {questionFormStatus}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}