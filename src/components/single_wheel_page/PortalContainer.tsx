import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';


//this function grabs all the styles from the component that
//gets wrapped with the portalComponent for the new window
function copyStyles (sourceDoc: Document, targetDoc: Document) {
    Array.from(sourceDoc.querySelectorAll('link[rel="stylesheet"], style'))
      .forEach(link => {
        targetDoc.head.appendChild(link.cloneNode(true));
      })
  }

  //defines type for the props "PortalContainer" will accept
  //it expects a chilcren prop aht tis a react node
interface PortalContainerProps {
  children: React.ReactNode;
}

const PortalContainer: React.FC<PortalContainerProps> = ({ children }) => {
    //useRef hook creates reference to created element
  const containerEl = useRef(document.createElement('div'));
  //useRef to stor reference to the new window
  const externalWindow = useRef<Window | null>(null);

  //runs after compnent mounts sets up new browser window
  useEffect(() => {
    // open a new browser window and store a reference to it
    externalWindow.current = window.open('', '', 'width=600,height=400,left=200,top=200');

    // append the container <div> (that has props.children appended to it) to the body of the new window
    if (externalWindow.current) {
      externalWindow.current.document.body.appendChild(containerEl.current);
      copyStyles(document, externalWindow.current.document);

    }

    return () => {
      // cleanup: close the window when the component unmounts
      if (externalWindow.current) {
        externalWindow.current.close();
      }
    };
  }, []);

  // append children to the container <div> that isn't mounted anywhere yet
  return ReactDOM.createPortal(children, containerEl.current);
};

export default PortalContainer;















