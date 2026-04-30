// "use client";

// import Box from "@mui/material/Box";

// export default function preloader() {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Box
//         component="img"
//         src="/images/loading.png" // put your image in public folder
//         alt="loading"
//         sx={{
//           width: 100,
//           height: 100,
//           mixBlendMode: "multiply", // 👈 removes white background
//           animation: "spin 1s linear infinite",
//         }}
//       />
//     </Box>
//   );
// }
"use client";

import Box from "@mui/material/Box";

const BARS = 12;

export default function Preloader() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "@keyframes spinner-fade": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0.15 },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 100, // 👈 matched to your image size
          height: 100, // 👈 matched to your image size
        }}
      >
        {Array.from({ length: BARS }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 5, // 👈 thicker dash
              height: 16, // 👈 longer dash
              borderRadius: 3,
              backgroundColor: "#555",
              transformOrigin: "center -22px", // 👈 larger radius to fill 100px container
              transform: `rotate(${(360 / BARS) * i}deg) translateY(-100%)`,
              animation: `spinner-fade ${BARS * 0.083}s linear infinite`,
              animationDelay: `${-((BARS - i) * 0.083).toFixed(3)}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
