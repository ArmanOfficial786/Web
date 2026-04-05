import Typography from "@mui/material/Typography";

interface FormTitleType {
  title: string;
}

function FormTitle({ title }: FormTitleType) {
  return (
    <Typography
      variant="body1"
      sx={{
        fontSize: "0.9rem",
        my: "0.75rem",
        pl: "0.25rem",
        fontWeight: "bold",
        color: "inherit",
      }}
    >
      {title}
    </Typography>
  );
}

export default FormTitle;
