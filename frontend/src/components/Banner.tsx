import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";

type AnnouncementBannerProps = {
  message: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  storageKey?: string;
  sticky?: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  role?: string;
  ariaLabel?: string;
  className?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      boxSizing: "border-box",
      padding: theme.spacing(1.5, 1.5),
      marginBottom: '13px',
      marginTop: '13px',
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontFamily: `'Roboto', ${theme.typography.fontFamily}`,
      fontSize: "1rem",
      fontWeight: 400,
      borderRadius: '5px',
    },
    surface: {
      backgroundColor: "#FFFFFF",
      color: theme.palette.text.primary,
      boxShadow:
        "0 0 0 5px rgba(255, 17, 0, 0.33), 0 6px 20px rgba(244,67,54,0.12), 0 2px 6px rgba(244,67,54,0.10)",
      "& a": {
        color: "inherit",
        textDecoration: "underline",
      },
    },
    sticky: {
      position: "sticky",
      top: 0,
      zIndex: theme.zIndex.appBar,
    },
    text: {
      flex: 1,
      fontWeight: 400,
      lineHeight: 1.4,
    },
    closeBtn: {
      cursor: "pointer",
      border: 0,
      background: "transparent",
      color: "inherit",
      padding: theme.spacing(0.5),
      lineHeight: 0,
      fontSize: 14,
    },
  })
);

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message,
  action,
  dismissible = true,
  storageKey,
  sticky = true,
  backgroundColor,
  onClose,
  role = "region",
  ariaLabel = "Announcement",
  className,
}) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState<boolean>(() => {
    if (!dismissible) return true;
    if (!storageKey) return true;
    try {
      return localStorage.getItem(storageKey) !== "1";
    } catch {
      return true;
    }
  });

  const handleClose = React.useCallback(() => {
    if (storageKey && dismissible) {
      try {
        localStorage.setItem(storageKey, "1");
      } catch {}
    }
    setVisible(false);
    onClose?.();
  }, [storageKey, dismissible, onClose]);

  if (!visible) return null;

  const classesToApply = [
    classes.root,
    classes.surface,
    sticky ? classes.sticky : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classesToApply}
      role={role}
      aria-label={ariaLabel}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <span className={classes.text}>{message}</span>
      {action}
      {dismissible && (
        <button
          type="button"
          className={classes.closeBtn}
          aria-label="Dismiss announcement"
          title="Dismiss"
          onClick={handleClose}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AnnouncementBanner;
