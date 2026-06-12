/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ServiceItem {
  title: string;
  desc: string;
}

export interface WebsiteCopy {
  brandName: string;
  brandLogo: string;
  hero: {
    tagline: string;
    subtitle: string;
    intro: string;
  };
  objectives: {
    title: string;
    description: string;
  };
  guavaProbi: {
    title: string;
    subtitle: string;
    description: string;
    whyChooseTitle: string;
    slogan: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  iris: {
    title: string;
    subtitle: string;
    description: string;
  };
  postHarvest: {
    title: string;
    subtitle: string;
    description: string;
    slogan: string;
  };
  rnd: {
    title: string;
    description: string;
    objectives: string;
  };
  projectAssistance: {
    title: string;
    description: string;
    services: ServiceItem[];
    capabilities: string;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
  };
}

const defaultCopy: WebsiteCopy = {
  brandName: 'FV Plus Agrotech Innovations',
  brandLogo: 'FV Plus Agrotech',
  hero: {
    tagline: 'Harvesting Innovation, Cultivating Prosperity',
    subtitle: "Freshness isn't luck. It's data",
    intro: 'FV Plus Agrotech Innovations is an emerging player in the field of fresh produce management. We specialize in pioneering and cost-effective technologies for processing fruits and vegetables. Our mission is to tackle food security challenges through cutting-edge solutions.',
  },
  objectives: {
    title: 'OUR WORKS AND OBJECTIVES',
    description: 'Our unwavering dedication lies in catalyzing the agri-economy through strategic value addition. We are committed to empowering diverse stakeholders, from farmers and traders to retailers, importers, and exporters. Our mission revolves around pioneering innovative solutions and sustainable practices, aimed at revolutionizing fresh produce management and fostering an environment for all individuals within the agricultural spectrum to thrive and prosper.',
  },
  guavaProbi: {
    title: 'Guava Probi',
    subtitle: 'Fruit Quality Assessment Solution',
    description: 'Guava Probi is an advanced fruit quality assessment solution designed to deliver fast, accurate, and data-driven insights into guava maturity, freshness, and overall quality. By enabling informed harvesting decisions, reducing post-harvest losses, and ensuring consistent fruit standards, it empowers growers, distributors, and retailers to improve efficiency, profitability, and sustainability across the supply chain.',
    whyChooseTitle: 'Why Choose Guava Probi?',
    slogan: 'Highly nutritious and an immunity booster. No added sugar. Natural and preservative free.',
    feature1Title: 'Immunity Booster',
    feature1Desc: 'Boost your immunity with natural probiotics that optimize digestion and enhance overall health.',
    feature2Title: 'Healthy Gut Flora',
    feature2Desc: 'Maintains and improves healthy gut flora.',
    feature3Title: 'Natural & Pure',
    feature3Desc: '100% natural whole-fruit nutrition with no added sugar or artificial preservatives.',
  },
  iris: {
    title: 'IRIS',
    subtitle: 'Connected Sensors. Intelligent Insights. Better Harvests.',
    description: 'Our advanced IoT sensors provide real-time monitoring of fruit quality and storage conditions, delivering accurate data for smarter agricultural decisions. Integrated with AI-powered analytics, they help detect changes early, optimize storage, reduce post-harvest losses, and maintain consistent quality. By transforming raw data into actionable insights, they improve efficiency, profitability, and sustainability across the fruit supply chain.',
  },
  postHarvest: {
    title: 'Post-Harvest Management',
    subtitle: 'Advanced Fruit Processing & Shelf-Life Extension',
    description: 'Our advanced processing technologies ensure optimal preservation of fruits and vegetables, maintaining their nutritional value while extending shelf life. From farm to table, we\'re revolutionizing the way produce is handled and processed.',
    slogan: 'We specialize in developing and applying game-changing solutions that mitigate post-harvest losses. Our core focus lies in leveraging innovative, affordable processing technologies.',
  },
  rnd: {
    title: 'Research & Development',
    description: 'Our cutting-edge research focuses on sustainability and innovation in the agriculture sector. We aim to revolutionize the industry through the development of IoT-enabled systems and advanced biotechnology solutions like Guava Probi and IRIS.',
    objectives: 'We aim to significantly increase the shelf life of fruits and vegetables while prioritizing the maintenance of their nutritional quality. We aim to enhance crop productivity, minimize waste, and ensure sustainable farming practices for a better future.',
  },
  projectAssistance: {
    title: 'Stuck In Your Project? Let Us Help You Move Forward!',
    description: 'At FV AgroTech Innovations, we understand the challenges that arise during project development. Whether you\'re facing roadblocks, encountering technical hurdles, or seeking expert guidance, our team of seasoned professionals is here to offer tailored assistance.',
    services: [
      {
        title: 'Expert Guidance',
        desc: 'Expert assistance to overcome technical challenges and optimize project execution.',
      },
      {
        title: 'Project Consultation',
        desc: 'Comprehensive guidance to ensure smooth and efficient project delivery.',
      },
      {
        title: 'Technical Support',
        desc: 'Innovative solutions tailored to your specific needs and challenges.',
      },
      {
        title: 'System Troubleshooting & Debugging',
        desc: 'Real-Time Issue Resolution & Troubleshooting for complex software and hardware platforms.',
      },
      {
        title: 'Project Roadmap & Strategic Planning',
        desc: 'Helping you align your goals with effective strategies and actionable target milestones.',
      },
      {
        title: 'Technology Feasibility & Prototype Development',
        desc: 'Specialized advice to help you achieve project goals successfully and deploy functional prototypes.',
      },
    ],
    capabilities: 'Operational Efficiency & Resource Management, Onboarding Assistance & Training Programs, Product Innovation & Lifecycle Management, Market Research & Competitive Analysis, Market Trend Analysis & Forecasting, Financial Planning & Investment Strategies, Long-Term Vision & Goal Alignment, Regulatory Compliance & Risk Management, User Feedback Collection & Continuous Improvement, Software Installation & Licensing Assistance, Network Configuration & Optimization, Hardware Performance Optimization & Upgrades, Emerging Technology Adoption & Implementation, Remote Assistance & IT Consulting',
  },
  contact: {
    title: 'Reach out to us for any inquiries, support, or feedback.',
    subtitle: 'Join us in building better lives!',
    address: 'Thapar Institute of Engineering and Technology, Patiala, Punjab, 147004',
  },
};

interface CopyEditorContextType {
  copy: WebsiteCopy;
  updateCopy: (path: string, value: any) => void;
  resetToDefaults: () => void;
}

const CopyEditorContext = createContext<CopyEditorContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'fv_agrotech_copy_data';

export const CopyEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copy, setCopy] = useState<WebsiteCopy>(defaultCopy);

  // Load from localStorage on client-side mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setCopy(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load copy from local storage', e);
    }
  }, []);

  const updateCopy = (path: string, value: any) => {
    setCopy((prev) => {
      const updated = { ...prev };
      const parts = path.split('.');
      let current: any = updated;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        current[part] = { ...current[part] };
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;

      // Save to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save copy to local storage', e);
      }

      return updated;
    });
  };

  const resetToDefaults = () => {
    setCopy(defaultCopy);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear local storage', e);
    }
  };

  return (
    <CopyEditorContext.Provider value={{ copy, updateCopy, resetToDefaults }}>
      {children}
    </CopyEditorContext.Provider>
  );
};

export const useCopy = () => {
  const context = useContext(CopyEditorContext);
  if (!context) {
    throw new Error('useCopy must be used within a CopyEditorProvider');
  }
  return context;
};
