export const PageConstraints = ({ children }: { children: any }) => {
  return <div style={{
    paddingLeft: "20%",
    paddingRight: "20%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start"
  }}>{children}</div>;
};
