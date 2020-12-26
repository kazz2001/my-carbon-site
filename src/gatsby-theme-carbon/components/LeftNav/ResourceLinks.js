import React from 'react';
import ResourceLinks from 'gatsby-theme-carbon/src/components/LeftNav/ResourceLinks';

const links = [
  {
    title: 'Mirror Site1', 
    href: 'http://planetky.com',
  },
  {
    title: 'Mirror Site2 (IBM Cloud)', 
    href: 'http://cdreview.mybluemix.net',
  },
  {
    title: 'Mirror Site3 (netlify)', 
    href: 'https://cdreview.netlify.app',
  },
];

// shouldOpenNewTabs: true if outbound links should open in a new tab
const CustomResources = () => <ResourceLinks shouldOpenNewTabs links={links} />;

export default CustomResources;
