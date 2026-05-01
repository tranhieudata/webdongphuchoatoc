'use client';
import NewsEditor from '../../_editor.jsx';
import { use } from 'react';

export default function NewsEditPage({ params }) {
  const { id } = use(params);
  return <NewsEditor editId={id} />;
}
