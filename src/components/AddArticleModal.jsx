import { useState, useEffect } from 'react';
import { M3 } from '../theme.js';
import { Scrim, Btn, IconBtn, FormInput } from './ui.jsx';
import { genId, domainOf, parseTags, makeQuestions } from '../utils.js';
import { ALL_CATEGORIES } from '../data.js';
import { generateSummary, generateQuestions, getApiKey } from '../api.js';

export default function AddArticleModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [cats, setCats] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    if (url && !source) {
      const d = domainOf(url);
      if (d) setSource(d);
    }
  }, [url]);

  const toggleCat = c => setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleGenSummary = async () => {
    if (!notes.trim() && !title.trim()) return;
    setGenerating(true);
    setGenError('');
    try {
      const result = await generateSummary(title.trim() || '(제목 없음)', notes.trim() || title.trim());
      setSummary(result);
    } catch (e) {
      if (e.message === 'NO_API_KEY') {
        setGenError('설정에서 API 키를 먼저 입력해주세요');
      } else {
        setGenError('생성 실패: ' + e.message);
      }
    } finally {
      setGenerating(false);
    }
  };

  const submit = async () => {
    if (!title.trim()) return;
    const t = title.trim();
    const n = notes.trim();
    const s = summary.trim();

    let questions = makeQuestions(t);
    if (getApiKey() && (n || s)) {
      setSavingQuestions(true);
      try {
        const aiQuestions = await generateQuestions(t, n, s);
        if (aiQuestions) questions = aiQuestions;
      } catch {}
      setSavingQuestions(false);
    }

    onAdd({
      id: genId(),
      title: t,
      url: url.trim(),
      source: source.trim() || '직접 입력',
      savedAt: new Date().toISOString(),
      categories: cats,
      tags: parseTags(tags),
      notes: n,
      summary: s,
      score: 0,
      reviewCount: 0,
      lastReviewedAt: null,
      questions,
    });
    onClose();
  };

  const hasApiKey = !!getApiKey();

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

        {/* Notes */}
        <FormInput
          label="노트"
          value={notes}
          onChange={setNotes}
          placeholder={"생각, 아이디어, 노션에서 복붙 — 자유롭게 적어두세요"}
          multiline
        />

        {/* Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: M3.onSurfaceVar, letterSpacing: 0.4 }}>한 줄 요약 (선택)</div>
            {hasApiKey ? (
              <button
                onClick={handleGenSummary}
                disabled={generating || (!notes.trim() && !title.trim())}
                style={{
                  height: 26, padding: '0 12px', borderRadius: 8, border: 0, cursor: 'pointer',
                  background: generating ? M3.surfContHigh : M3.primaryCont,
                  color: M3.onPrimaryCont, fontSize: 12, fontWeight: 500,
                  fontFamily: 'Roboto,system-ui', opacity: generating ? 0.6 : 1,
                }}
              >
                {generating ? '생성 중…' : '✦ AI 생성'}
              </button>
            ) : (
              <span style={{ fontSize: 11, color: M3.onSurfaceVar }}>API 키 설정 시 AI 자동 생성</span>
            )}
          </div>
          {genError && (
            <div style={{ fontSize: 12, color: M3.error, marginBottom: 6 }}>{genError}</div>
          )}
          <input
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="직접 입력하거나 AI 생성 버튼을 눌러보세요"
            style={{
              width: '100%', height: 40, border: `1px solid ${M3.outlineVar}`, borderRadius: 10,
              padding: '0 12px', fontSize: 14, color: M3.onSurface, background: M3.surfContLow,
              fontFamily: 'Roboto,system-ui', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

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
          <Btn variant="filled" icon={savingQuestions ? 'hourglass_top' : 'add'} onClick={submit} disabled={!title.trim() || savingQuestions}>
            {savingQuestions ? '질문 생성 중…' : '저장하기'}
          </Btn>
        </div>
      </div>
    </>
  );
}
