import React, { useState } from "react";

interface MessageProps {
  contents: string;
}

const styles = {
  button: {
    marginLeft: 8,
    border: 0,
    padding: 0,
    cursor: "pointer",
    borderRadius: "0.25rem",
    fontFamily: "inherit",
  },
  codeMessage: {
    opacity: 0.5,
  },
};

export const Message = ({ contents }: MessageProps) => {
  const [isDecoded, setIsDecoded] = useState(false);
  const message = isDecoded ? decodeMessage(contents) : contents;
  const toggleDecoded = () => setIsDecoded(!isDecoded);
  const containsCode =
    contents.endsWith("=") || contents.includes("VEhBTksgWU9V");

  return (
    <div>
      {containsCode && (
        <div>
          <pre style={styles.codeMessage}>
            {isDecoded
              ? "This message has been decoded"
              : "This message appears to be encoded"}
            ...
            <button style={styles.button} onClick={toggleDecoded}>
              {isDecoded ? "ENCODE" : "DECODE"} MESSAGE
            </button>
          </pre>
        </div>
      )}
      <div>{message}</div>
      <style jsx>
        {`
          pre {
            white-space: pre-wrap; /* css-3 */
            white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
            white-space: -pre-wrap; /* Opera 4-6 */
            white-space: -o-pre-wrap; /* Opera 7 */
            word-wrap: break-word; /* Internet Explorer 5.5+ */
          }
        `}
      </style>
    </div>
  );
};

function decodeMessage(message: string) {
  const messageParts = message.split(" ");

  return messageParts.map((part) => {
    const isBase64 = part.endsWith("=") || part == "VEhBTksgWU9V";

    if (isBase64) {
      let partDecoded = "";
      if (part == "VEhBTksgWU9V==") {
        partDecoded = "THANK YOU";
      } else {
        partDecoded = atob(part);
      }

      if (partDecoded.startsWith("<svg")) {
        const patchedSVG = patchReflectionsSVG(partDecoded);
        return <div dangerouslySetInnerHTML={{ __html: patchedSVG }} />;
      }

      if (partDecoded.startsWith("#")) {
        return (
          <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
            {partDecoded}
          </pre>
        );
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
