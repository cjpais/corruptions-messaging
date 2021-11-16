import React, { useState } from "react";

interface MessageProps {
  contents: string;
}

const styles = {
  button: {
    marginTop: 16,
    border: "1px solid white",
    padding: "4px 12px",
    cursor: "pointer",
    borderRadius: "0.25rem",
  },
};

export const Message = ({ contents }: MessageProps) => {
  const [isDecoded, setIsDecoded] = useState(false);
  const message = isDecoded ? decodeMessage(contents) : contents;
  const toggleDecoded = () => setIsDecoded(!isDecoded);
  const containsCode = contents.includes("==");

  return (
    <div>
      <div>{message}</div>
      {containsCode && (
        <button style={styles.button} onClick={toggleDecoded}>
          {isDecoded ? "ENCODE" : "DECODE"}
        </button>
      )}
    </div>
  );
};

function decodeMessage(message: string) {
  const messageParts = message.split(" ");

  return messageParts.map((part) => {
    const isBase64 = part.endsWith("==");

    if (isBase64) {
      const partDecoded = atob(part);

      if (partDecoded.startsWith("<svg")) {
        const patchedSVG = patchReflectionsSVG(partDecoded);
        return <div dangerouslySetInnerHTML={{ __html: patchedSVG }} />;
      }

      if (partDecoded.startsWith("#")) {
        return <pre>{partDecoded}</pre>;
      }
      return partDecoded;
    }
    return `${part} `;
  });
}

// the Reflections Corruption SVG was sent without browser prefixes
// this fixes rendering for safari
function patchReflectionsSVG(svg: string) {
  const marker = `<g transform="scale(-4 4)" transform-origin="164 0">`;
  const isReflectionsSVG = svg.includes(marker);
  if (!isReflectionsSVG) return svg;

  const patch = `
    g {
      -moz-transform: scale(-4, 4);
      -webkit-transform: scale(-4, 4);
      -o-transform: scale(-4, 4);
      -ms-transform: scale(-4, 4);
      transform: scale(-4, 4);
    }
  `;

  return svg.split("</style>").join(`${patch}</style>`);
}
