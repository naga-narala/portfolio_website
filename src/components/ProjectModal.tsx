import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { X, Github, ToggleLeft as Kaggle, HelpCircle, Send } from 'lucide-react';

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

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Question submitted:', questionFormData);
    setQuestionFormStatus('Submitted (placeholder)');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1a0404] rounded-lg max-w-3xl w-full relative overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-3xl font-bold text-red-500 mb-4">{project.title}</h2>

          {!showQuestionForm && (
            <div className="aspect-video mb-6">
              <YouTube
                videoId={project.youtubeId}
                className="w-full h-full"
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            </div>
          )}

          {!showQuestionForm && (
            <p className="text-gray-400 mb-6">{project.description}</p>
          )}

          {!showQuestionForm && (
            <div className="flex flex-wrap gap-4">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href={project.kaggleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                <Kaggle className="w-5 h-5" />
                <span>Kaggle</span>
              </a>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors text-white"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Ask a Question</span>
              </button>
            </div>
          )}

          {showQuestionForm && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-red-400">Ask a Question about {project.title}</h3>
                <button onClick={() => setShowQuestionForm(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="contact-input"
                    value={questionFormData.name}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="contact-input"
                    value={questionFormData.email}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Question / Query"
                    rows={5}
                    className="contact-input"
                    value={questionFormData.query}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, query: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Review & Submit
                  <Send className="w-4 h-4 ml-2" />
                </button>
                {questionFormStatus && <p className="mt-2 text-sm text-green-500">{questionFormStatus}</p>}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}