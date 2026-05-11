import { marked } from 'marked';
import { M3 } from '../theme.js';

marked.setOptions({ breaks: true, gfm: true });

export default function Markdown({ text, style }) {
  if (!text) return null;
  const html = marked.parse(text);
  return (
    <div
      className="md-body"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
