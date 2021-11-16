import React from "react";

interface MessageProps {
  contents: string;
}

export const Message = ({ contents }: MessageProps) => {
  return <div>{decodeMessage(contents)}</div>;
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
