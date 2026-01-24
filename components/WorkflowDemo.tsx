'use client';

import { useState } from 'react';

type WorkflowTab = 'lead-enrichment' | 'content-repurposing' | 'meeting-notes';

export default function WorkflowDemo() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('lead-enrichment');

  const workflows = {
    'lead-enrichment': {
      title: 'Lead Enrichment',
      description: 'Automatically research and score new leads',
      nodes: ['New Lead', 'Enrich Data', 'Score Lead', 'Notify Team']
    },
    'content-repurposing': {
      title: 'Content Repurposing',
      description: 'Turn one blog post into multi-platform content',
      nodes: ['Publish Post', 'AI Summary', 'Social Posts', 'Schedule']
    },
    'meeting-notes': {
      title: 'Meeting Notes',
      description: 'Record, transcribe, and extract action items',
      nodes: ['Record', 'Transcribe', 'Extract Tasks', 'Create Tickets']
    }
  };

  const currentWorkflow = workflows[activeTab];

  return (
    <section className="px-6 md:px-12 py-24 bg-primary-cyan/3 rounded-xl my-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          See Automation in Action
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          Real-world workflows that eliminate manual work and drive results
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-primary-cyan/10 pb-4">
          {(Object.keys(workflows) as WorkflowTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary-cyan/10 border border-primary-cyan text-primary-cyan'
                  : 'border border-primary-cyan/20 text-gray-400 hover:border-primary-cyan/40'
              }`}
            >
              {workflows[tab].title}
            </button>
          ))}
        </div>

        {/* Workflow Canvas - Simplified for now, will add React Flow later */}
        <div className="h-96 bg-dark-lighter/50 border border-primary-cyan/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-primary-cyan mb-2">
            {currentWorkflow.title}
          </h3>
          <p className="text-gray-400 mb-8">{currentWorkflow.description}</p>

          {/* Simple node visualization */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {currentWorkflow.nodes.map((node, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="px-6 py-4 bg-primary-cyan/10 border-2 border-primary-cyan rounded-lg text-primary-cyan font-semibold animate-pulse">
                  {node}
                </div>
                {index < currentWorkflow.nodes.length - 1 && (
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary-cyan to-primary-blue relative">
                    <div className="absolute right-0 top-[-4px] w-0 h-0 border-l-[8px] border-l-primary-blue border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
