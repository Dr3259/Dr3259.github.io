import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComparePage from '@/app/compare/page';

describe('ComparePage', () => {
  it('renders Chinese labels when navigator language is zh', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'zh-CN',
      configurable: true,
    });
    render(<ComparePage />);
    expect(screen.getByText('维度对比')).toBeInTheDocument();
    expect(screen.getByText('返回AI观察')).toBeInTheDocument();
    expect(screen.getByText(/敬请期待/)).toBeInTheDocument();
  });
});
