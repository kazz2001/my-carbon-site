import React from 'react';
import Footer from 'gatsby-theme-carbon/src/components/Footer';
import PlanetkyLogo from './planetkylogo.gif';

const Logo = () => (
  <img src="http://bm.planetky.com/flipwhiteh.gif" />
);

const Content = ({ buildTime }) => (
  <>
    <p>
      The <code>Content</code> component receives a <code>buildTime</code> prop
      that to display your site's build time: {buildTime}
    </p>
  </>
);

const links = {
  firstCol: [
    { href: 'https://ibm.com/design', linkText: 'IBM Carbon Design System' },
  ],
  secondCol: [
    { href: 'https://gatsby-theme-carbon.now.sh/', linkText: 'Gatuby Carbon Theme' },
  ],
};

const CustomFooter = () => <Footer links={links} Content={Content} Logo={Logo} />;

export default CustomFooter;
