import React from 'react';
import YouTube from 'react-youtube';
import { X, Github, ToggleLeft as Kaggle, Youtube } from 'lucide-react';

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
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a0404] rounded-lg max-w-3xl w-full relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-3xl font-bold text-red-500 mb-4">{project.title}</h2>
          
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
          
          <p className="text-gray-400 mb-6">{project.description}</p>
          
          <div className="flex gap-4">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href={project.kaggleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Kaggle className="w-5 h-5" />
              <span>Kaggle</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}