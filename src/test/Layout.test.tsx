import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../components/Layout';

const renderWithRouter = (component: React.ReactElement, initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      {component}
    </MemoryRouter>
  );
};

describe('Layout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('does not show navigation on home page', () => {
    renderWithRouter(
      <Layout>
        <div>Home Content</div>
      </Layout>,
      '/'
    );
    
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Return to home page/i })).not.toBeInTheDocument();
  });

  it('shows navigation on non-home pages', () => {
    renderWithRouter(
      <Layout>
        <div>App Content</div>
      </Layout>,
      '/calculator'
    );
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: /Return to home page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveTextContent('Home');
  });

  it('has proper semantic structure', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      '/calculator'
    );
    
    // Should have navigation and main landmarks
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('navigation link has proper accessibility label', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      '/calculator'
    );
    
    const homeLink = screen.getByRole('link', { name: /Return to home page/i });
    expect(homeLink).toHaveAttribute('aria-label', 'Return to home page');
  });
});