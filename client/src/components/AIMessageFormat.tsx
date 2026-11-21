import { Streamdown } from "streamdown";
// import { code } from "@streamdown/code";
// import { math } from "@streamdown/math";
// import { mermaid } from "@streamdown/mermaid";

// import "katex/dist/katex.min.css";
// import "streamdown/styles.css";


type AIMessageFormatProps = {
  content: string;
  isStreaming?: boolean;
}


export default function AIMessageFormat({content,isStreaming = false}: AIMessageFormatProps) {
  return (
    <div className="ai-message [&_:not(pre)>code]:bg-transparent [&_:not(pre)>code]:text-peach [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-line">
      <Streamdown
        // plugins={{ code, math, mermaid }}
        isAnimating={isStreaming}
        animated
        caret="block"
        controls={{
          code: { copy: true, download: true },
          table: { copy: true, download: true },
        }}
      >
        {content}
      </Streamdown>
    </div>
  );
}
