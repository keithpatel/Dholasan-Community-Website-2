import React from 'react';
import { useContent } from '../context/ContentContext';
import PageBlockRenderer from '../components/blocks/PageBlockRenderer';
import { defaultPageLayouts } from '../data/contentStore';

const HomePage: React.FC = () => {
  const { pageLayouts } = useContent();
  const homeBlocks = pageLayouts.home || defaultPageLayouts.home;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <PageBlockRenderer blocks={homeBlocks} fallbackBlocks={defaultPageLayouts.home} />
    </div>
  );
};

export default HomePage;