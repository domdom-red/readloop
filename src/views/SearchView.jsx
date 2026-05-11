import { useState, useMemo, useRef, useEffect } from 'react';
import { M3 } from '../theme.js';
import { Icon } from '../components/ui.jsx';
import ArticleCard from '../components/ArticleCard.jsx';

export default function SearchView({ articles, onOpenArticle }) {
  const [q, setQ] = useState('');
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.tags.some(t => t.toLowerCase().includes(lower)) ||
      a.categories.some(c => c.toLowerCase().includes(lower)) ||
      a.source.toLowerCase().includes(lower),
    );
  }, [q, articles]);

  return (
    <div style={{ padding: '28px 28px 56px', maxWidth: 800 }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 500, color: M3.onSurface }}>검색</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: M3.surfContHigh, borderRadius: 12, padding: '0 16px', height: 52, marginBottom: 24 }}>
        <Icon name="search" size={22} color={M3.onSurfaceVar} />
        <input
          ref={ref}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="제목, 요약, 태그, 카테고리로 검색…"
          style={{ flex: 1, border: 0, background: 'transparent', fontSize: 16, color: M3.onSurface, outline: 'none', fontFamily: 'Roboto,system-ui' }}
        />
        {q && (
          <button onClick={() => setQ('')} style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Icon name="close" size={18} color={M3.onSurfaceVar} />
          </button>
        )}
      </div>

      {q && (
        <div style={{ fontSize: 13, color: M3.onSurfaceVar, marginBottom: 16 }}>
          {results.length > 0 ? `${results.length}개 결과` : '검색 결과가 없어요'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.map(a => <ArticleCard key={a.id} article={a} onClick={() => onOpenArticle(a)} />)}
      </div>

      {!q && (
        <div style={{ textAlign: 'center', marginTop: 60, color: M3.onSurfaceVar }}>
          <Icon name="manage_search" size={48} color={M3.outlineVar} />
          <div style={{ marginTop: 12, fontSize: 16 }}>저장한 아티클을 검색해보세요</div>
        </div>
      )}
    </div>
  );
}
