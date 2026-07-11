import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // If the path actually changed, snap to the top instantly for a clean page load
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // If the user clicks a link to the page they are ALREADY on, glide up smoothly
    if (navType === "PUSH" || navType === "REPLACE") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [navType, pathname]); // Re-runs whenever a navigation action is triggered

  return null;
}
