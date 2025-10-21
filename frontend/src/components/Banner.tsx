import React from "react";
import { makeStyles, Theme, createStyles, Collapse, Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";

type AnnouncementBannerProps = {
  message: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  sticky?: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  role?: string;
  ariaLabel?: string;
  className?: string;
  details?: React.ReactNode;
  defaultExpanded?: boolean;
  learnMoreLabel?: string;
  hideDetailsLabel?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      boxSizing: "border-box",
      padding: theme.spacing(1.5, 1.5),
      marginBottom: "13px",
      marginTop: "13px",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: 0,
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontFamily: `'Roboto', ${theme.typography.fontFamily}`,
      fontSize: "1rem",
      fontWeight: 400,
      borderRadius: "5px",
    },
    surface: {
      backgroundColor: "#FFFFFF",
      color: theme.palette.text.primary,
      boxShadow:
        "0 0 0 5px rgba(255, 17, 0, 0.33), 0 6px 20px rgba(244,67,54,0.12), 0 2px 6px rgba(244,67,54,0.10)",
      "& a": { color: "inherit", textDecoration: "underline" },
    },
    sticky: {
      position: "sticky",
      top: 0,
      zIndex: theme.zIndex.appBar,
    },
    bannerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      minHeight: 40,
      gap: theme.spacing(2),
    },
    text: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      lineHeight: 1.2,
      fontWeight: 400,
    },
    learnMoreBtn: {
      textTransform: "none",
      fontSize: "0.875rem",
      fontWeight: 500,
      alignSelf: "center",
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
    detailsWrap: {
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      alignSelf: "stretch",
      marginTop: theme.spacing(1),
      padding: theme.spacing(1.25, 1.5),
      borderRadius: 6,
      background: "#fff",
      boxShadow:
        "0 0 0 2px rgba(255, 17, 0, 0.18) inset, 0 2px 8px rgba(244,67,54,0.08)",
    },
    expandIcon: {
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
      transform: "rotate(0deg)",
      marginLeft: theme.spacing(0.5),
    },
    expandIconOpen: {
      transform: "rotate(180deg)",
    },
  })
);



const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message,
  action,
  dismissible = true,
  sticky = true,
  backgroundColor,
  onClose,
  role = "region",
  ariaLabel = "Announcement",
  className,
  details,
  defaultExpanded = false,
  learnMoreLabel = "Learn more",
  hideDetailsLabel = "Hide",
}) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState<boolean>(true);
  const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded);
  const detailsId = React.useMemo(
    () => `banner-details-${Math.random().toString(36).slice(2)}`,
    []
  );

  const handleClose = React.useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

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
      <div className={classes.bannerRow}>
        <span className={classes.text}>{message}</span>

        {details && (
          <Button
          size="small"
          className={classes.learnMoreBtn}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-controls={detailsId}
        >
          {expanded ? hideDetailsLabel : learnMoreLabel}
          <span
            className={clsx(classes.expandIcon, { [classes.expandIconOpen]: expanded })}
            aria-hidden="true"
          >
            ▼
          </span>
        </Button>
        )}

        {action}

        {dismissible && (
          <Button
            size="small"
            className={classes.learnMoreBtn}
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            endIcon={
              <ExpandMoreIcon
                fontSize="small"
                className={clsx(classes.expandIcon, { [classes.expandIconOpen]: expanded })}
              />
            }
          >
            {expanded ? hideDetailsLabel : learnMoreLabel}
          </Button>
        )}
      </div>

      {details && (
        <Collapse in={expanded}>
          <div id={detailsId} className={classes.detailsWrap}>
            {details}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default AnnouncementBanner;
