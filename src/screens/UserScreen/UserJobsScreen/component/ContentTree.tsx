
import Highlighter from "react-highlight-words";

export const ContentTree = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        lineHeight: 1.6,
      }}
    >
      <Highlighter
        searchWords={[highlight]}
        textToHighlight={text}
        highlightStyle={{
          backgroundColor: "#09993e",
          fontWeight: "bold",
          padding: "0 4px",
          borderRadius: "4px",
          color: "white",
        }}
      />
    </div>
  );
};
