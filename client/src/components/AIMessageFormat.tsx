import { Streamdown } from "streamdown";
import "./AIMessageFormat.css";
import { code } from "@streamdown/code";
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
    <div className="ai-message">
      <Streamdown
        className="ai-markdown"
        // plugins={{ code, math, mermaid }}
        plugins={{ code }}
        shikiTheme={["one-dark-pro", "one-dark-pro"]}
        isAnimating={isStreaming}
        lineNumbers={false}
        animated
        caret="block"
        controls={{
          code: { copy: true, download: true },
          table: { copy: true, download: true, fullscreen: true },
        }}
      >
        {content}
      </Streamdown>
    </div>
  );
}
