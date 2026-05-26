import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (context: { error: Error; reset: () => void }) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  private reload = (): void => {
    window.location.reload();
  };

  override render(): ReactNode {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback({ error, reset: this.reset });
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="bg-surface flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <h1 className="text-text text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-text-muted max-w-md text-sm">
          An unexpected error occurred. You can try again, and if the issue
          persists, reload the page.
        </p>
        <div className="flex gap-3">
          <Button onClick={this.reset}>Try again</Button>
          <Button variant="outline" onClick={this.reload}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
