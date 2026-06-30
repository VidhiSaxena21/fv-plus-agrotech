'use client';

import React, { useState } from 'react';
import { useCopy } from './CopyEditorContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CopyEditorPanel() {
  const { copy, updateCopy, resetToDefaults } = useCopy();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'objectives' | 'probi' | 'iris' | 'assistance' | 'contact'>('hero');

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(copy, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'fv_agrotech_content.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleInputChange = (path: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateCopy(path, e.target.value);
  };

  const handleServiceChange = (index: number, field: 'title' | 'desc', value: string) => {
    const updatedServices = [...copy.projectAssistance.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    updateCopy('projectAssistance.services', updatedServices);
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Brand' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'probi', label: 'Fruit Probi' },
    { id: 'iris', label: 'IoT & Process' },
    { id: 'assistance', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.5)] border border-emerald-400/20 active:scale-95 transition-all duration-300 font-semibold tracking-wide text-sm group"
        title="Customize website text content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Customize Copy</span>
      </button>

      {/* Editor Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-[#0c1e0c]/95 border-l border-emerald-800/30 shadow-[-10px_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col font-sans text-gray-100 backdrop-blur-xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-emerald-950/40 flex items-center justify-between bg-emerald-950/30">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-emerald-400">Copy Control Panel</h2>
                  <p className="text-xs text-gray-400 mt-1">Modify any text box below to update the site live.</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-emerald-900/40 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto scrollbar-none border-b border-emerald-950/40 bg-[#081508] px-4 py-2 gap-1.5 shrink-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-800 text-white shadow-md'
                        : 'text-gray-400 hover:bg-emerald-900/20 hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Form Fields (text boxes) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {activeTab === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Brand Logo Text</label>
                      <input
                        type="text"
                        value={copy.brandLogo}
                        onChange={(e) => handleInputChange('brandLogo', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Brand Name</label>
                      <input
                        type="text"
                        value={copy.brandName}
                        onChange={(e) => handleInputChange('brandName', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Hero Tagline</label>
                      <input
                        type="text"
                        value={copy.hero.tagline}
                        onChange={(e) => handleInputChange('hero.tagline', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Hero Subtitle</label>
                      <input
                        type="text"
                        value={copy.hero.subtitle}
                        onChange={(e) => handleInputChange('hero.subtitle', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Intro Block</label>
                      <textarea
                        rows={5}
                        value={copy.hero.intro}
                        onChange={(e) => handleInputChange('hero.intro', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'objectives' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Objectives Title</label>
                      <input
                        type="text"
                        value={copy.objectives.title}
                        onChange={(e) => handleInputChange('objectives.title', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Objectives Description</label>
                      <textarea
                        rows={8}
                        value={copy.objectives.description}
                        onChange={(e) => handleInputChange('objectives.description', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'probi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Probi Title</label>
                      <input
                        type="text"
                        value={copy.guavaProbi.title}
                        onChange={(e) => handleInputChange('guavaProbi.title', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Probi Subtitle</label>
                      <input
                        type="text"
                        value={copy.guavaProbi.subtitle}
                        onChange={(e) => handleInputChange('guavaProbi.subtitle', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Product Description</label>
                      <textarea
                        rows={4}
                        value={copy.guavaProbi.description}
                        onChange={(e) => handleInputChange('guavaProbi.description', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Section Title (Slogan Area)</label>
                      <input
                        type="text"
                        value={copy.guavaProbi.whyChooseTitle}
                        onChange={(e) => handleInputChange('guavaProbi.whyChooseTitle', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Slogan</label>
                      <input
                        type="text"
                        value={copy.guavaProbi.slogan}
                        onChange={(e) => handleInputChange('guavaProbi.slogan', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div className="border-t border-emerald-950/40 pt-4 space-y-4">
                      <h4 className="text-sm font-semibold text-emerald-400">Features List</h4>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Feature 1 Title</label>
                        <input
                          type="text"
                          value={copy.guavaProbi.feature1Title}
                          onChange={(e) => handleInputChange('guavaProbi.feature1Title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mb-1">Feature 1 Description</label>
                        <textarea
                          rows={2}
                          value={copy.guavaProbi.feature1Desc}
                          onChange={(e) => handleInputChange('guavaProbi.feature1Desc', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Feature 2 Title</label>
                        <input
                          type="text"
                          value={copy.guavaProbi.feature2Title}
                          onChange={(e) => handleInputChange('guavaProbi.feature2Title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mb-1">Feature 2 Description</label>
                        <textarea
                          rows={2}
                          value={copy.guavaProbi.feature2Desc}
                          onChange={(e) => handleInputChange('guavaProbi.feature2Desc', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Feature 3 Title</label>
                        <input
                          type="text"
                          value={copy.guavaProbi.feature3Title}
                          onChange={(e) => handleInputChange('guavaProbi.feature3Title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mb-1">Feature 3 Description</label>
                        <textarea
                          rows={2}
                          value={copy.guavaProbi.feature3Desc}
                          onChange={(e) => handleInputChange('guavaProbi.feature3Desc', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'iris' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-emerald-400 border-b border-emerald-950/40 pb-2">IRIS IoT Systems</h4>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">IRIS Title</label>
                        <input
                          type="text"
                          value={copy.iris.title}
                          onChange={(e) => handleInputChange('iris.title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">IRIS Subtitle</label>
                        <input
                          type="text"
                          value={copy.iris.subtitle}
                          onChange={(e) => handleInputChange('iris.subtitle', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">IRIS Description</label>
                        <textarea
                          rows={4}
                          value={copy.iris.description}
                          onChange={(e) => handleInputChange('iris.description', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-emerald-950/40">
                      <h4 className="text-sm font-semibold text-emerald-400 border-b border-emerald-950/40 pb-2">Post-Harvest Technology</h4>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Processing Title</label>
                        <input
                          type="text"
                          value={copy.postHarvest.title}
                          onChange={(e) => handleInputChange('postHarvest.title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Processing Subtitle</label>
                        <input
                          type="text"
                          value={copy.postHarvest.subtitle}
                          onChange={(e) => handleInputChange('postHarvest.subtitle', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Processing Description</label>
                        <textarea
                          rows={4}
                          value={copy.postHarvest.description}
                          onChange={(e) => handleInputChange('postHarvest.description', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Post-Harvest Slogan</label>
                        <textarea
                          rows={3}
                          value={copy.postHarvest.slogan}
                          onChange={(e) => handleInputChange('postHarvest.slogan', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'assistance' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-emerald-400 border-b border-emerald-950/40 pb-2">Research & Development</h4>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">R&D Heading</label>
                        <input
                          type="text"
                          value={copy.rnd.title}
                          onChange={(e) => handleInputChange('rnd.title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">R&D Description</label>
                        <textarea
                          rows={4}
                          value={copy.rnd.description}
                          onChange={(e) => handleInputChange('rnd.description', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">R&D Objectives</label>
                        <textarea
                          rows={4}
                          value={copy.rnd.objectives}
                          onChange={(e) => handleInputChange('rnd.objectives', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-emerald-950/40">
                      <h4 className="text-sm font-semibold text-emerald-400 border-b border-emerald-950/40 pb-2">Project Assistance Overview</h4>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Assistance Title</label>
                        <input
                          type="text"
                          value={copy.projectAssistance.title}
                          onChange={(e) => handleInputChange('projectAssistance.title', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Assistance Description</label>
                        <textarea
                          rows={4}
                          value={copy.projectAssistance.description}
                          onChange={(e) => handleInputChange('projectAssistance.description', e)}
                          className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-emerald-950/40">
                      <h4 className="text-sm font-semibold text-emerald-400">Core Services List</h4>
                      {copy.projectAssistance.services.map((service, idx) => (
                        <div key={idx} className="bg-black/25 p-3 rounded-lg border border-emerald-950/40 space-y-2">
                          <label className="block text-[10px] font-bold text-gray-400">Service {idx + 1} Title</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                            className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 transition duration-200"
                          />
                          <label className="block text-[10px] font-bold text-gray-400 mt-2">Service {idx + 1} Description</label>
                          <textarea
                            rows={2}
                            value={service.desc}
                            onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)}
                            className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 transition duration-200 resize-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-emerald-950/40">
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Additional Capabilities (Comma Separated)</label>
                      <textarea
                        rows={6}
                        value={copy.projectAssistance.capabilities}
                        onChange={(e) => handleInputChange('projectAssistance.capabilities', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Contact Section Title</label>
                      <textarea
                        rows={3}
                        value={copy.contact.title}
                        onChange={(e) => handleInputChange('contact.title', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Contact Subtitle</label>
                      <input
                        type="text"
                        value={copy.contact.subtitle}
                        onChange={(e) => handleInputChange('contact.subtitle', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Official Address</label>
                      <textarea
                        rows={3}
                        value={copy.contact.address}
                        onChange={(e) => handleInputChange('contact.address', e)}
                        className="w-full bg-black/40 border border-emerald-800/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-emerald-950/40 bg-emerald-950/20 flex gap-4 shrink-0">
                <button
                  onClick={resetToDefaults}
                  className="flex-1 px-4 py-2.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 rounded-lg text-xs font-bold transition duration-200 active:scale-95"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={exportToJson}
                  className="flex-1 px-4 py-2.5 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-400 hover:text-emerald-300 border border-emerald-800/30 rounded-lg text-xs font-bold transition duration-200 active:scale-95"
                >
                  Export JSON
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
