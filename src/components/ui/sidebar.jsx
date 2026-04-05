// src/components/ui/sidebar.jsx
"use client";

import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 70;
const MOBILE_SIDEBAR_WIDTH = 280;
const TRANSITION_DURATION = 0.3;
const HOVER_DELAY = 150;

// ─── Styles ───────────────────────────────────────────────────────────────────
const sidebarStyles = `
  .sidebar-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .sidebar-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  }
  
  /* Ensure text is always visible */
  .sidebar-link-text {
    color: inherit;
    opacity: 1;
  }
`;

// ─── Context ──────────────────────────────────────────────────────────────────
const SidebarContext = createContext(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  defaultOpen = false,
}) => {
  const [desktopOpen, setDesktopOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const open = openProp !== undefined ? openProp : desktopOpen;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setDesktopOpen;

  const shouldAnimate = animate && !shouldReduceMotion;

  const value = {
    open,
    setOpen,
    animate: shouldAnimate,
    mobileOpen,
    setMobileOpen,
    activeLink,
    setActiveLink,
    isMobile,
    expandedWidth: SIDEBAR_WIDTH_EXPANDED,
    collapsedWidth: SIDEBAR_WIDTH_COLLAPSED,
    mobileWidth: MOBILE_SIDEBAR_WIDTH,
  };

  return (
    <SidebarContext.Provider value={value}>
      <style dangerouslySetInnerHTML={{ __html: sidebarStyles }} />
      {children}
    </SidebarContext.Provider>
  );
};

// ─── Main Sidebar Wrapper ─────────────────────────────────────────────────────
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate = true,
  defaultOpen = false,
}) => {
  return (
    <SidebarProvider
      open={open}
      setOpen={setOpen}
      animate={animate}
      defaultOpen={defaultOpen}
    >
      {children}
    </SidebarProvider>
  );
};

// ─── Sidebar Body ─────────────────────────────────────────────────────────────
export const SidebarBody = ({ className, children, ...props }) => {
  return (
    <>
      <DesktopSidebar className={className} {...props}>
        {children}
      </DesktopSidebar>
      <MobileSidebar className={className} {...props}>
        {children}
      </MobileSidebar>
    </>
  );
};

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate, expandedWidth, collapsedWidth } = useSidebar();
  const timeoutRef = useRef(null);
  const sidebarRef = useRef(null);
  const navId = useId();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }, [setOpen]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, HOVER_DELAY);
  }, [setOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        sidebarRef.current?.focus();
      }
    },
    [open, setOpen]
  );

  const currentWidth = animate
    ? open
      ? expandedWidth
      : collapsedWidth
    : expandedWidth;

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-400"
      >
        Skip to main content
      </a>

      <motion.aside
        ref={sidebarRef}
        id="desktop-sidebar"
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={open}
        tabIndex={-1}
        className={cn(
          "fixed top-0 left-0 h-screen z-40",
          "hidden md:flex flex-col",
          "bg-neutral-50 border-r border-gray-200/80",
          "shadow-sm",
          className
        )}
        animate={{
          width: currentWidth,
        }}
        transition={{
          duration: animate ? TRANSITION_DURATION : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <nav
          id={navId}
          className="sidebar-scrollbar flex h-full flex-col overflow-x-hidden overflow-y-auto px-3 py-4"
        >
          {children}
        </nav>
      </motion.aside>

      {/* Spacer */}
      <div
        className="hidden md:block flex-shrink-0 transition-all duration-300"
        style={{ width: currentWidth }}
        aria-hidden="true"
      />
    </>
  );
};

// ─── Mobile Sidebar (FIXED) ───────────────────────────────────────────────────
export const MobileSidebar = ({ className, children, ...props }) => {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Lock body scroll and manage focus
  useEffect(() => {
    if (mobileOpen) {
      lastFocusedElement.current = document.activeElement;

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }

      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus trap
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* ─── Mobile Header Bar (FIXED) ─── */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-30",
          "flex h-14 items-center justify-between",
          "border-b border-gray-200 bg-white/95 backdrop-blur-sm",
          "px-4 shadow-sm",
          "md:hidden"
        )}
      >
        {/* Menu Button */}
        <button
          type="button"
          className={cn(
            "flex h-10 w-10 items-center justify-center",
            "rounded-lg bg-gray-100 text-gray-700",
            "transition-all duration-150",
            "hover:bg-gray-200 hover:text-gray-900",
            "active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          )}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar"
        >
          <Menu size={22} aria-hidden="true" strokeWidth={2} />
        </button>

        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-base font-semibold text-gray-900">
            snax club
          </span>
        </div>

        {/* Spacer for centering */}
        <div className="w-10" />
      </header>

      {/* ─── Spacer for fixed header ─── */}
      <div className="h-14 md:hidden" aria-hidden="true" />

      {/* ─── Mobile Drawer (FIXED) ─── */}
      <AnimatePresence mode="wait">
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              ref={drawerRef}
              key="mobile-drawer"
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{
                duration: TRANSITION_DURATION,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                "fixed top-0 left-0 z-[101] h-full",
                "w-[85vw] max-w-[300px] min-w-[260px]",
                "bg-white shadow-2xl",
                "flex flex-col",
                "md:hidden",
                className
              )}
              {...props}
            >
              {/* ─── Drawer Header ─── */}
              <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 shadow-sm">
                    <span className="text-sm font-bold text-white">S</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    snax club
                  </span>
                </div>

                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-lg bg-gray-100 text-gray-600",
                    "transition-all duration-150",
                    "hover:bg-gray-200 hover:text-gray-800",
                    "active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                  )}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X size={20} aria-hidden="true" strokeWidth={2} />
                </button>
              </div>

              {/* ─── Drawer Content ─── */}
              <nav className="sidebar-scrollbar flex flex-1 flex-col overflow-y-auto px-3 py-4">
                {children}
              </nav>

              {/* ─── Drawer Footer (Optional branding) ─── */}
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="text-center text-xs text-gray-400">
                  © 2024 snax club
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Sidebar Link (FIXED for Mobile) ──────────────────────────────────────────
export const SidebarLink = ({
  link,
  className,
  onClick,
  isActive = false,
  ...props
}) => {
  const { open, animate, setMobileOpen, setActiveLink, isMobile } = useSidebar();
  const tooltipRef = useRef(null);
  const linkRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState("right");

  useEffect(() => {
    if (!open && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      const tooltipWidth = 120;

      if (rect.right + tooltipWidth > window.innerWidth) {
        setTooltipPosition("left");
      } else {
        setTooltipPosition("right");
      }
    }
  }, [open]);

  const handleClick = useCallback(
    (e) => {
      setMobileOpen(false);

      if (link.label) {
        setActiveLink(link.label);
      }

      if (onClick) {
        onClick(e);
      }

      if (link.href === "#") {
        e.preventDefault();
      }
    },
    [link.href, link.label, onClick, setMobileOpen, setActiveLink]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e);
      }
    },
    [handleClick]
  );

  const isCurrentlyActive = isActive;

  // Always show full content on mobile
  const showFullContent = isMobile || open;

  return (
    <a
      ref={linkRef}
      href={link.href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={isCurrentlyActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-3",
        "text-gray-600 transition-all duration-150",
        "hover:bg-gray-100 hover:text-gray-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
        "active:scale-[0.98]",
        // Active state
        isCurrentlyActive && "bg-gray-100 text-gray-900 font-medium shadow-sm",
        className
      )}
      {...props}
    >
      {/* Active indicator */}
      {isCurrentlyActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gray-900"
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "flex h-6 w-6 flex-shrink-0 items-center justify-center transition-colors",
          isCurrentlyActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
        )}
        aria-hidden="true"
      >
        {React.cloneElement(link.icon, {
          size: 22,
          strokeWidth: isCurrentlyActive ? 2.5 : 2,
        })}
      </span>

      {/* Label - ALWAYS VISIBLE ON MOBILE */}
      {isMobile ? (
        // Mobile: Always show full label
        <span
          className={cn(
            "sidebar-link-text text-[15px] leading-tight",
            isCurrentlyActive ? "font-semibold text-gray-900" : "font-medium text-gray-700"
          )}
        >
          {link.label}
        </span>
      ) : (
        // Desktop: Animate based on open state
        <motion.span
          animate={
            animate
              ? {
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                  marginLeft: open ? 0 : -8,
                }
              : { opacity: 1, width: "auto", marginLeft: 0 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "sidebar-link-text truncate text-sm",
            isCurrentlyActive ? "font-semibold text-gray-900" : "font-medium text-gray-700"
          )}
        >
          {link.label}
        </motion.span>
      )}

      {/* Tooltip (collapsed desktop state only) */}
      {!open && animate && !isMobile && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute top-1/2 z-50 -translate-y-1/2",
            "rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white",
            "opacity-0 shadow-lg transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            "hidden md:block whitespace-nowrap",
            tooltipPosition === "right" ? "left-full ml-3" : "right-full mr-3"
          )}
        >
          {link.label}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent",
              tooltipPosition === "right"
                ? "-left-3 border-r-gray-900"
                : "-right-3 border-l-gray-900"
            )}
          />
        </div>
      )}
    </a>
  );
};

// ─── Sidebar Section ──────────────────────────────────────────────────────────
export const SidebarSection = ({ title, children, className }) => {
  const { open, animate, isMobile } = useSidebar();

  // Always show section title on mobile
  const showTitle = isMobile || open;

  return (
    <div className={cn("space-y-1", className)}>
      {title && (
        <>
          {isMobile ? (
            // Mobile: Always show
            <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {title}
            </h3>
          ) : (
            // Desktop: Animate
            <motion.h3
              animate={
                animate
                  ? {
                      opacity: open ? 1 : 0,
                      height: open ? "auto" : 0,
                    }
                  : { opacity: 1, height: "auto" }
              }
              transition={{ duration: 0.2 }}
              className="mb-2 overflow-hidden px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400"
            >
              {title}
            </motion.h3>
          )}
        </>
      )}
      {children}
    </div>
  );
};

// ─── Sidebar Divider ──────────────────────────────────────────────────────────
export const SidebarDivider = ({ className }) => {
  return <hr className={cn("my-3 border-gray-200", className)} />;
};

// ─── Sidebar Footer ───────────────────────────────────────────────────────────
export const SidebarFooter = ({ children, className }) => {
  return (
    <div className={cn("mt-auto border-t border-gray-200 pt-4", className)}>
      {children}
    </div>
  );
};

// ─── Export width constants ───────────────────────────────────────────────────
export const SIDEBAR_WIDTHS = {
  expanded: SIDEBAR_WIDTH_EXPANDED,
  collapsed: SIDEBAR_WIDTH_COLLAPSED,
  mobile: MOBILE_SIDEBAR_WIDTH,
};