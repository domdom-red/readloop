import { useState, useEffect } from 'react';
import { M3 } from '../theme.js';
import { Scrim, Btn, IconBtn, FormInput } from './ui.jsx';
import { genId, domainOf, parseTags, makeQuestions } from '../utils.js';
import { ALL_CATEGORIES } from '../data.js';

export default function AddArticleModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (url && !source) {
      const d = domainOf(url);
      if (d) setSource(d);
    }
  }, [url]);

  const toggleCat = c => setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      id: genId(),
      title: title.trim(),
      url: url.trim(),
      source: source.trim() || '직접 입력',
      savedAt: new Date().toISOString(),
      categories: cats,
      tags: parseTags(tags),
      summary: summary.trim(),
      score: 0,
      reviewCount: 0,
      lastReviewedAt: null,
      questions: makeQuestions(title.trim()),
    });
    onClose();
  };

  return (
    <>
      <Scrim onClick={onClose} z={300} />
      <div className="anim-slide" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 400, width: 560, maxWidth: 'calc(100vw - 32px)', maxHeight: '90vh',
        background: M3.surface, borderRadius: 28, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: M3.onSurface }}>아티클 추가</div>
          <IconBtn name="close" onClick={onClose} />
        </div>

        <FormInput label="제목" value={title} onChange={setTitle} placeholder="아티클 제목을 입력하세요" required />
        <FormInput label="URL" value={url} onChange={setUrl} placeholder="https://..." />
        <FormInput label="출처" value={source} onChange={setSource} placeholder="서핏, 브런치, 뉴스레터 등" />
        <FormInput label="요약 / 메모" value={summary} onChange={setSummary} placeholder="핵심 내용이나 읽으면서 느낀 점을 적어두세요" multiline />
        <FormInput label="태그 (쉼표로 구분)" value={tags} onChange={setTags} placeholder="디자인 시스템, AI, Figma MCP" />

        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: M3.onSurfaceVar, letterSpacing: 0.4, marginBottom: 8 }}>카테고리</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleCat(c)} style={{
                height: 30, padding: '0 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: 13, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                border: cats.includes(c) ? 0 : `1px solid ${M3.outlineVar}`,
                background: cats.includes(c) ? M3.primaryCont : 'transparent',
                color: cats.includes(c) ? M3.onPrimaryCont : M3.onSurfaceVar,
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn variant="text" onClick={onClose}>취소</Btn>
          <Btn variant="filled" icon="add" onClick={submit} disabled={!title.trim()}>저장하기</Btn>
        </div>
      </div>
    </>
  );
}
