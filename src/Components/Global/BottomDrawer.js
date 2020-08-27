import React, { useRef, useLayoutEffect } from "react";
import { createGesture } from "@ionic/core";
import "Styles/Global/BottomDrawer.scss";

const BottomDrawer = ({ children, is_open, close_handler, ...rest }) => {
  // const [is_drawer_open, set_is_drawer_open] = useState(false);
  const drawer_ref = useRef(null);
  const drawer_content_ref = useRef(null);
  const drawer_overlay_click_handler = (e) => {
    if (
      drawer_content_ref.current &&
      e.target.contains(drawer_content_ref.current)
    ) {
      close_handler();
    }
  };

  useLayoutEffect(() => {
    if (drawer_ref.current) {
      const close_gesture = createGesture({
        el: drawer_ref.current,
        gestureName: "down-swipe",
        direction: "y",
        onMove: (event) => {
          if (event.deltaY > 20) {
            close_handler();
          }
        },
      });

      // enable the gesture for the item
      close_gesture.enable(true);
    }
  }, []);

  return (
    <div
      {...rest}
      className={`bottom-drawer ${rest.className ? rest.className : ""} ${
        is_open ? "is-open" : ""
      }`}
      ref={drawer_ref}
      onClick={drawer_overlay_click_handler}
    >
      <div className="inner" ref={drawer_content_ref}>
        <div className="content">
          <div className="close-bar" onClick={close_handler} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomDrawer;
