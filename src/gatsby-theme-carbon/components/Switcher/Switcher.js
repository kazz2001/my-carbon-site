import React, {
  useContext,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import cx from 'classnames';
import useMedia from 'use-media';
import { Locked16 } from '@carbon/icons-react';
import NavContext from '../../util/context/NavContext';
import { nav, open, divider, link, linkDisabled } from './Switcher.module.scss';

const Switcher = ({ children }) => {
  const lgBreakpoint = useMedia('min-width: 1056px');
  const { switcherIsOpen, toggleNavState } = useContext(NavContext);
  const listRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const collapseOpenNavs = function (e) {
      if (e.which === 27) {
        toggleNavState('switcherIsOpen', 'close');
      }
    };

    document.addEventListener('keyup', collapseOpenNavs);

    return function cleanup() {
      document.removeEventListener('keyup', collapseOpenNavs);
    };
  }, [toggleNavState]);

  // calculate and update height
  useLayoutEffect(() => {
    if (switcherIsOpen) {
      setHeight(listRef.current.offsetHeight + 40);
    } else {
      setHeight(0);
    }
  }, [listRef, switcherIsOpen]);

  const maxHeight = !lgBreakpoint && switcherIsOpen ? '100%' : `${height}px`;

  return (
    <nav
      className={cx(nav, { [open]: switcherIsOpen })}
      aria-label="IBM Design ecosystem"
      tabIndex="-1"
      style={{ maxHeight }}>
      <ul ref={listRef}>{children}</ul>
    </nav>
  );
};

export const SwitcherDivider = (props) => (
  <li className={divider}>
    <span {...props} />
  </li>
);

export const SwitcherLink = ({
  disabled,
  children,
  isInternal,
  href: hrefProp,
  ...rest
}) => {
  const href = disabled || !hrefProp ? undefined : hrefProp;
  const className = disabled ? linkDisabled : link;
  const { switcherIsOpen } = useContext(NavContext);
  const openTabIndex = disabled ? '-1' : 0;

  return (
    <li>
      <a
        aria-disabled={disabled}
        role="button"
        tabIndex={switcherIsOpen ? openTabIndex : '-1'}
        className={className}
        href={href}
        {...rest}>
        {children}
        {isInternal && <Locked16 />}
      </a>
    </li>
  );
};

// https://css-tricks.com/using-css-transitions-auto-dimensions/
// Note: if you change this, update the max-height in the switcher stylesheet
const DefaultChildren = () => (
  <>
    <SwitcherDivider>Foundations</SwitcherDivider>
    <SwitcherLink href="https://www.carbondesignsystem.com/">
      Carbon Design System
    </SwitcherLink>
  </>
);

Switcher.defaultProps = {
  children: <DefaultChildren />,
};

export default Switcher;