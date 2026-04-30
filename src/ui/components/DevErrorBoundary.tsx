import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
  stack: string;
}

/**
 * Dev-only error boundary to avoid a blank screen and show actionable errors.
 * This should only be mounted in development.
 */
export class DevErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    message: '',
    stack: '',
  };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : '';

    return {
      hasError: true,
      message,
      stack,
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('[DevErrorBoundary] Runtime error:', error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{ padding: 16, fontFamily: 'monospace', color: '#111' }}>
        <h2>Development Runtime Error</h2>
        <p>The app crashed during rendering. Details are shown below.</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>
{this.state.message}
        </pre>
        {this.state.stack ? (
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>
{this.state.stack}
          </pre>
        ) : null}
        <p>Open browser DevTools console for full context.</p>
      </div>
    );
  }
}
