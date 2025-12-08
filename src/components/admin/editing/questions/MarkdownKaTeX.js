import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex';

export const MarkdownKaTeX = ({ content, className }) => (
    <div className={className}>
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{ p: ({ node, ...props }) => <span {...props} /> }}
        >
            {preprocessForKaTeX(content)}
        </ReactMarkdown>
    </div>
);
