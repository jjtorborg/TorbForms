import { ImageResponse } from "next/og";

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#000000",
        borderRadius: 6,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: "-0.5px",
        paddingTop: 3,
      }}
    >
      TF
    </div>,
    { width: 32, height: 32 },
  );
}
